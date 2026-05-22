<?php

// app/Http/Controllers/Dashboard/ProductBrandController.php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ProductBrand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductBrandController extends Controller
{
    public function index()
    {
        $brands = ProductBrand::withCount('products')
            ->orderBy('name')
            ->get();

        return Inertia::render('Dashboard/ProductBrands/Index', [
            'brands' => $brands,
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/ProductBrands/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:product_brands,name',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'is_active' => 'boolean',
        ]);

        // Generate slug from name
        $validated['slug'] = Str::slug($validated['name']);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('brands', 'public');
            $validated['logo'] = $logoPath;
        }

        ProductBrand::create($validated);

        return redirect()->route('dashboard.brands.index')
            ->with('success', 'Brand created successfully.');
    }

    public function edit(ProductBrand $brand)
    {
        return Inertia::render('Dashboard/ProductBrands/Form', [
            'brand' => $brand,
        ]);
    }

    public function update(Request $request, ProductBrand $brand)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:product_brands,name,'.$brand->id,
            'description' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'is_active' => 'boolean',
        ]);

        // Generate slug from name if name changed
        if ($validated['name'] !== $brand->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($brand->logo && \Storage::exists($brand->logo)) {
                \Storage::delete($brand->logo);
            }

            $logoPath = $request->file('logo')->store('brands', 'public');
            $validated['logo'] = $logoPath;
        } else {
            // Keep existing logo if no new file uploaded
            unset($validated['logo']);
        }

        $brand->update($validated);

        return redirect()->route('dashboard.brands.index')
            ->with('success', 'Brand updated successfully.');
    }

    public function destroy(ProductBrand $brand)
    {
        // Check if brand has products
        if ($brand->products()->exists()) {
            return redirect()->route('dashboard.brands.index')
                ->with('error', 'Cannot delete brand that has products.');
        }

        // Delete logo if exists
        if ($brand->logo && \Storage::exists($brand->logo)) {
            \Storage::delete($brand->logo);
        }

        $brand->delete();

        return redirect()->route('dashboard.brands.index')
            ->with('success', 'Brand deleted successfully.');
    }

    public function deleteLogo(ProductBrand $brand)
    {
        if ($brand->logo && \Storage::exists($brand->logo)) {
            \Storage::delete($brand->logo);
        }

        $brand->update(['logo' => null]);

        return redirect()->back()
            ->with('success', 'Brand logo deleted successfully.');
    }
}
