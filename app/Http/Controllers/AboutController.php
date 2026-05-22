<?php

// app/Http/Controllers/AboutController.php

namespace App\Http\Controllers;

use App\Models\Company;
use Inertia\Inertia;

class AboutController extends Controller
{
    public function index()
    {
        $company = Company::first();

        if (! $company) {
            // Fallback data jika company belum ada
            $company = [
                'name' => 'Nama Perusahaan',
                'about' => 'Deskripsi tentang perusahaan Anda...',
                'description' => 'Deskripsi singkat perusahaan...',
                'phone' => '+62 812-3456-7890',
                'email' => 'info@perusahaan.com',
                'address' => 'Alamat perusahaan Anda',
                'logo' => null,
                'favicon' => null,
                'whatsapp_number' => '6281234567890',
                'whatsapp_message' => 'Halo, saya tertarik dengan produk Anda',
                'social_media' => [],
            ];
        }

        return Inertia::render('About/Index', [
            'company' => $company,
        ]);
    }
}
