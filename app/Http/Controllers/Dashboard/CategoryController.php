<?php

// app/Http/Controllers/Dashboard/CategoryController.php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('parent')
            ->orderBy('parent_id')
            ->orderBy('order')
            ->get();

        return Inertia::render('Dashboard/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        $parentCategories = Category::whereNull('parent_id')
            ->orderBy('name')
            ->get();

        return Inertia::render('Dashboard/Categories/Form', [
            'parentCategories' => $parentCategories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'parent_id' => 'nullable|exists:categories,id',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Generate slug from name
        $validated['slug'] = Str::slug($validated['name']);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('categories', 'public');
            $validated['image'] = $imagePath;
        }

        Category::create($validated);

        return redirect()->route('dashboard.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function edit(Category $category)
    {
        $parentCategories = Category::whereNull('parent_id')
            ->where('id', '!=', $category->id)
            ->orderBy('name')
            ->get();

        return Inertia::render('Dashboard/Categories/Form', [
            'category' => $category,
            'parentCategories' => $parentCategories,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,'.$category->id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'parent_id' => 'nullable|exists:categories,id',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Generate slug from name if name changed
        if ($validated['name'] !== $category->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($category->image && \Storage::exists($category->image)) {
                \Storage::delete($category->image);
            }

            $imagePath = $request->file('image')->store('categories', 'public');
            $validated['image'] = $imagePath;
        } else {
            // Keep existing image if no new file uploaded
            unset($validated['image']);
        }

        $category->update($validated);

        return redirect()->route('dashboard.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        // Check if category has products
        if ($category->products()->exists()) {
            return redirect()->route('dashboard.categories.index')
                ->with('error', 'Cannot delete category that has products.');
        }

        // Check if category has children
        if ($category->children()->exists()) {
            return redirect()->route('dashboard.categories.index')
                ->with('error', 'Cannot delete category that has subcategories.');
        }

        // Delete image if exists
        if ($category->image && \Storage::exists($category->image)) {
            \Storage::delete($category->image);
        }

        $category->delete();

        return redirect()->route('dashboard.categories.index')
            ->with('success', 'Category deleted successfully.');
    }

    public function deleteImage(Category $category)
    {
        if ($category->image && \Storage::exists($category->image)) {
            \Storage::delete($category->image);
        }

        $category->update(['image' => null]);

        return redirect()->back()
            ->with('success', 'Category image deleted successfully.');
    }
}
