<?php

// app/Http/Controllers/ProductController.php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Company;
use App\Models\Product;
use App\Models\ProductBrand;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['brand', 'categories', 'images'])
            ->active()
            ->latest();

        $products = $query->get();

        $categories = Category::active()
            ->main()
            ->withCount(['products' => function ($query) {
                $query->active();
            }])
            ->ordered()
            ->get();

        $brands = ProductBrand::active()
            ->withCount(['products' => function ($query) {
                $query->active();
            }])
            ->orderBy('name')
            ->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'filters' => $request->only(['search', 'category', 'brand']),
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['brand', 'categories', 'images']);

        // Get related products
        $relatedProducts = Product::with(['brand', 'categories'])
            ->active()
            ->where('id', '!=', $product->id)
            ->whereHas('categories', function ($query) use ($product) {
                $query->whereIn('categories.id', $product->categories->pluck('id'));
            })
            ->limit(4)
            ->get();

        $company = Company::first();

        $linkUrl = "https://wa.me/?phone={$company->whatsapp_number}&text=Saya ingin konsultasi produk {$product->name}";

        return Inertia::render('Products/Show', [
            'product' => $product,
            'linkUrl' => $linkUrl,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
