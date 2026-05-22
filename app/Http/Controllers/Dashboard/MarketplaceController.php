<?php

// app/Http/Controllers/Dashboard/MarketplaceController.php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Marketplace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MarketplaceController extends Controller
{
    public function index(Request $request)
    {
        $marketplaces = Marketplace::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderBy('order')
            ->orderBy('name')
            ->get();

        return Inertia::render('Dashboard/Marketplaces/Index', [
            'marketplaces' => $marketplaces,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Dashboard/Marketplaces/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:marketplaces,name',
            'slug' => 'nullable|string|max:255|unique:marketplaces,slug',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'url' => 'required|url|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        // Generate slug if not provided
        $slug = $request->slug ?: Str::slug($request->name);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('marketplaces', 'public');
        }

        Marketplace::create([
            'name' => $request->name,
            'slug' => $slug,
            'logo' => $logoPath,
            'url' => $request->url,
            'description' => $request->description,
            'is_active' => $request->is_active ?? true,
            'order' => $request->order ?? 0,
        ]);

        return redirect('/dashboard/marketplaces')
            ->with('success', 'Marketplace created successfully.');
    }

    public function edit(Marketplace $marketplace)
    {
        return Inertia::render('Dashboard/Marketplaces/Edit', [
            'marketplace' => $marketplace,
        ]);
    }

    public function update(Request $request, Marketplace $marketplace)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:marketplaces,name,'.$marketplace->id,
            'slug' => 'nullable|string|max:255|unique:marketplaces,slug,'.$marketplace->id,
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'url' => 'required|url|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $slug = $request->slug ?: Str::slug($request->name);

        $logoPath = $marketplace->logo;
        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($marketplace->logo) {
                Storage::disk('public')->delete($marketplace->logo);
            }
            $logoPath = $request->file('logo')->store('marketplaces', 'public');
        }

        $marketplace->update([
            'name' => $request->name,
            'slug' => $slug,
            'logo' => $logoPath,
            'url' => $request->url,
            'description' => $request->description,
            'is_active' => $request->is_active,
            'order' => $request->order ?? 0,
        ]);

        return redirect('/dashboard/marketplaces')
            ->with('success', 'Marketplace updated successfully.');
    }

    public function destroy(Marketplace $marketplace)
    {
        // Delete logo file if exists
        if ($marketplace->logo) {
            Storage::disk('public')->delete($marketplace->logo);
        }

        $marketplace->delete();

        return redirect('/dashboard/marketplaces')
            ->with('success', 'Marketplace deleted successfully.');
    }
}
