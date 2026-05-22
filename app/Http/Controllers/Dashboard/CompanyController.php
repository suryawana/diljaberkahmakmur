<?php

// app/Http/Controllers/Dashboard/CompanyController.php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function edit()
    {
        $company = Company::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'PT. Furnitur Medika Indonesia',
                'about' => 'Deskripsi perusahaan Anda...',
                'phone' => '+6221-1234-5678',
                'email' => 'info@furniturmedika.co.id',
                'address' => 'Jl. Kesehatan No. 123, Jakarta Pusat 10510',
                'description' => 'Spesialis Furnitur dan Perlengkapan Rumah Sakit Berkualitas Tinggi',
                'whatsapp_number' => '6281234567890',
                'whatsapp_message' => 'Halo, saya tertarik dengan produk furnitur rumah sakit dari PT. Furnitur Medika Indonesia',
                'is_active' => true,
            ]
        );

        return Inertia::render('Dashboard/Companies/Edit', [
            'company' => $company,
        ]);
    }

    public function update(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'about' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email',
            'address' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'favicon' => 'nullable|image|mimes:ico,png|max:1024',
            'description' => 'nullable|string',
            'whatsapp_number' => 'required|string',
            'whatsapp_message' => 'nullable|string',
            'social_media' => 'nullable|array',
        ]);

        $company = Company::first();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($company->logo && Storage::exists($company->logo)) {
                Storage::delete($company->logo);
            }

            $logoPath = $request->file('logo')->store('companies', 'public');
            $validated['logo'] = $logoPath;
        } else {
            // Keep existing logo if no new file uploaded
            unset($validated['logo']);
        }

        // Handle favicon upload
        if ($request->hasFile('favicon')) {
            // Delete old favicon if exists
            if ($company->favicon && Storage::exists($company->favicon)) {
                Storage::delete($company->favicon);
            }

            $faviconPath = $request->file('favicon')->store('companies', 'public');
            $validated['favicon'] = $faviconPath;
        } else {
            // Keep existing favicon if no new file uploaded
            unset($validated['favicon']);
        }

        $company->update($validated);

        return redirect()->route('dashboard.companies.edit')
            ->with('success', 'Company profile updated successfully.');
    }

    public function deleteLogo()
    {
        $company = Company::first();

        if ($company->logo && Storage::exists($company->logo)) {
            Storage::delete($company->logo);
        }

        $company->update(['logo' => null]);

        return redirect()->route('dashboard.companies.edit')
            ->with('success', 'Logo deleted successfully.');
    }

    public function deleteFavicon()
    {
        $company = Company::first();

        if ($company->favicon && Storage::exists($company->favicon)) {
            Storage::delete($company->favicon);
        }

        $company->update(['favicon' => null]);

        return redirect()->route('dashboard.companies.edit')
            ->with('success', 'Favicon deleted successfully.');
    }
}
