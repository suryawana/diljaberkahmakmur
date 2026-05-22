<?php

// database/seeders/CompanySeeder.php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    public function run()
    {
        Company::create([
            'name' => 'PT. Furnitur Medika Indonesia',
            'about' => 'Kami adalah perusahaan spesialis furnitur dan perlengkapan rumah sakit yang telah berpengalaman lebih dari 10 tahun dalam menyediakan produk-produk berkualitas tinggi untuk kebutuhan medis. Komitmen kami adalah memberikan kenyamanan dan keamanan bagi pasien dan tenaga medis.',
            'phone' => '+6221-1234-5678',
            'email' => 'info@furniturmedika.co.id',
            'address' => 'Jl. Kesehatan No. 123, Jakarta Pusat 10510',
            'logo' => 'companies/logo.png',
            'favicon' => 'companies/favicon.ico',
            'description' => 'Spesialis Furnitur dan Perlengkapan Rumah Sakit Berkualitas Tinggi',
            'whatsapp_number' => '6281234567890',
            'whatsapp_message' => 'Halo, saya tertarik dengan produk furnitur rumah sakit dari PT. Furnitur Medika Indonesia',
            'social_media' => [
                'facebook' => 'https://facebook.com/furniturmedika',
                'instagram' => 'https://instagram.com/furniturmedika',
                'twitter' => 'https://twitter.com/furniturmedika',
                'linkedin' => 'https://linkedin.com/company/furniturmedika',
            ],
        ]);
    }
}
