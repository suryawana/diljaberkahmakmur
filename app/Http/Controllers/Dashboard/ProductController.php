<?php

// app/Http/Controllers/Dashboard/ProductController.php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductBrand;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['brand', 'categories', 'images'])
            ->withCount('categories', 'images')
            ->latest()
            ->get();

        return Inertia::render('Dashboard/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        $brands = ProductBrand::active()->orderBy('name')->get();
        $categories = Category::active()->orderBy('name')->get();

        return Inertia::render('Dashboard/Products/Form', [
            'brands' => $brands,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'required|string',
            'specifications' => 'nullable|array',
            'features' => 'nullable|array',
            'main_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'product_brand_id' => 'nullable|exists:product_brands,id',
            'whatsapp_message' => 'nullable|string',
            'is_active' => 'boolean',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
            'additional_images' => 'nullable|array',
            'additional_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        // Generate slug from name
        $validated['slug'] = Str::slug($validated['name']);

        // Handle main image upload
        if ($request->hasFile('main_image')) {
            $mainImagePath = $request->file('main_image')->store('products', 'public');
            $validated['main_image'] = $mainImagePath;
        }

        // Handle specifications and features
        $validated['specifications'] = $this->formatSpecifications($request->specifications);
        $validated['features'] = $this->formatFeatures($request->features);

        // Create product
        $product = Product::create($validated);

        // Sync categories
        if ($request->has('category_ids')) {
            $product->categories()->sync($request->category_ids);
        }

        // Handle additional images
        if ($request->hasFile('additional_images')) {
            foreach ($request->file('additional_images') as $index => $image) {
                $imagePath = $image->store('products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $imagePath,
                    'order' => $index,
                    'alt_text' => $product->name.' - Image '.($index + 1),
                ]);
            }
        }

        return redirect()->route('dashboard.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $brands = ProductBrand::active()->orderBy('name')->get();
        $categories = Category::active()->orderBy('name')->get();
        $product->load(['categories', 'images']);

        return Inertia::render('Dashboard/Products/Form', [
            'product' => $product,
            'brands' => $brands,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:products,name,'.$product->id,
            'description' => 'required|string',
            'specifications' => 'nullable|array',
            'features' => 'nullable|array',
            'main_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'product_brand_id' => 'nullable|exists:product_brands,id',
            'whatsapp_message' => 'nullable|string',
            'is_active' => 'boolean',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
            'additional_images' => 'nullable|array',
            'additional_images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Generate slug from name if name changed
        if ($validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle main image upload
        if ($request->hasFile('main_image')) {
            // Delete old main image if exists
            if ($product->main_image && Storage::exists($product->main_image)) {
                Storage::delete($product->main_image);
            }

            $mainImagePath = $request->file('main_image')->store('products', 'public');
            $validated['main_image'] = $mainImagePath;
        } else {
            // Keep existing main image if no new file uploaded
            unset($validated['main_image']);
        }

        // Handle specifications and features
        $validated['specifications'] = $this->formatSpecifications($request->specifications);
        $validated['features'] = $this->formatFeatures($request->features);

        // Update product
        $product->update($validated);

        // Sync categories
        if ($request->has('category_ids')) {
            $product->categories()->sync($request->category_ids);
        } else {
            $product->categories()->detach();
        }

        // Handle additional images
        if ($request->hasFile('additional_images')) {
            $existingImagesCount = $product->images()->count();

            foreach ($request->file('additional_images') as $index => $image) {
                $imagePath = $image->store('products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $imagePath,
                    'order' => $existingImagesCount + $index,
                    'alt_text' => $product->name.' - Image '.($existingImagesCount + $index + 1),
                ]);
            }
        }

        return redirect()->route('dashboard.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        // Delete main image
        if ($product->main_image && Storage::exists($product->main_image)) {
            Storage::delete($product->main_image);
        }

        // Delete additional images
        foreach ($product->images as $image) {
            if (Storage::exists($image->image_path)) {
                Storage::delete($image->image_path);
            }
            $image->delete();
        }

        // Detach categories
        $product->categories()->detach();

        $product->delete();

        return redirect()->route('dashboard.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    public function deleteMainImage(Product $product)
    {
        if ($product->main_image && Storage::exists($product->main_image)) {
            Storage::delete($product->main_image);
        }

        $product->update(['main_image' => null]);

        return redirect()->back()
            ->with('success', 'Main image deleted successfully.');
    }

    public function deleteAdditionalImage(ProductImage $productImage)
    {
        if ($productImage->image_path && Storage::exists($productImage->image_path)) {
            Storage::delete($productImage->image_path);
        }

        $productImage->delete();

        return redirect()->back()
            ->with('success', 'Additional image deleted successfully.');
    }

    private function formatSpecifications($specifications)
    {
        if (! $specifications) {
            return null;
        }

        $formatted = [];
        foreach ($specifications as $spec) {
            if (! empty($spec['key']) && ! empty($spec['value'])) {
                $formatted[] = [
                    'key' => $spec['key'],
                    'value' => $spec['value'],
                ];
            }
        }

        return ! empty($formatted) ? $formatted : null;
    }

    private function formatFeatures($features)
    {
        if (! $features) {
            return null;
        }

        $formatted = [];
        foreach ($features as $feature) {
            if (! empty($feature)) {
                $formatted[] = $feature;
            }
        }

        return ! empty($formatted) ? $formatted : null;
    }
}
