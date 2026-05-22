<?php

// app/Http/Controllers/BrandController.php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        $brands = Brand::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderBy('order')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Brands/Index', [
            'brands' => $brands,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Brands/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:brands,name',
             'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'description' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('brands', 'public');
        }

        Brand::create([
            'name' => $request->name,
            'logo' => $logoPath,
            'description' => $request->description,
            'website' => $request->website,
            'is_active' => $request->is_active ?? true,
            'order' => $request->order ?? 0,
        ]);

        return redirect()->route('admin.brands.index')
            ->with('success', 'Brand berhasil ditambahkan.');
    }

    public function edit(Brand $brand)
    {
        return Inertia::render('Admin/Brands/Edit', [
            'brand' => $brand,
        ]);
    }

    public function update(Request $request, Brand $brand)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:brands,name,'.$brand->id,
             'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'description' => 'nullable|string',
            'website' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $logoPath = $brand->logo;
        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($brand->logo) {
                Storage::disk('public')->delete($brand->logo);
            }
            $logoPath = $request->file('logo')->store('brands', 'public');
        }

        $brand->update([
            'name' => $request->name,
            'logo' => $logoPath,
            'description' => $request->description,
            'website' => $request->website,
            'is_active' => $request->is_active,
            'order' => $request->order ?? 0,
        ]);

        return redirect()->route('admin.brands.index')
            ->with('success', 'Brand berhasil diperbarui.');
    }

    public function destroy(Brand $brand)
    {
        // Delete logo file if exists
        if ($brand->logo) {
            Storage::disk('public')->delete($brand->logo);
        }

        $brand->delete();

        return redirect()->route('admin.brands.index')
            ->with('success', 'Brand berhasil dihapus.');
    }
}
