<?php

// app/Http/Controllers/CategoryController.php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::active()
            ->main()
            ->with(['children' => function ($query) {
                $query->active()->withCount(['products' => function ($query) {
                    $query->active();
                }]);
            }])
            ->withCount(['products' => function ($query) {
                $query->active();
            }])
            ->orderBy('order')
            ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function show(Category $category, Request $request)
    {
        $category->load(['children', 'parent']);

        $products = Product::with(['brand', 'categories', 'images'])
            ->active()
            ->whereHas('categories', function ($query) use ($category) {
                $query->where('categories.id', $category->id);
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        // Get sibling categories
        $siblingCategories = Category::active()
            ->where('parent_id', $category->parent_id)
            ->where('id', '!=', $category->id)
            ->withCount(['products' => function ($query) {
                $query->active();
            }])
            ->get();

        return Inertia::render('Categories/Show', [
            'category' => $category,
            'products' => $products,
            'siblingCategories' => $siblingCategories,
        ]);
    }
}
