<?php

// database/seeders/ProductBrandSeeder.php

namespace Database\Seeders;

use App\Models\ProductBrand;
use Illuminate\Database\Seeder;

class ProductBrandSeeder extends Seeder
{
    public function run()
    {
        $brands = [
            [
                'name' => 'MediComfort',
                'slug' => 'medicomfort',
                'description' => 'Brand khusus untuk produk textile rumah sakit dengan kenyamanan terbaik',
                'logo' => 'brands/medicomfort.png',
                'is_active' => true,
            ],
            [
                'name' => 'HospitalPro',
                'slug' => 'hospitalpro',
                'description' => 'Produk furnitur profesional untuk rumah sakit dan klinik',
                'logo' => 'brands/hospitalpro.png',
                'is_active' => true,
            ],
            [
                'name' => 'SafeCare',
                'slug' => 'safecare',
                'description' => 'Spesialis perlengkapan keamanan dan kenyamanan pasien',
                'logo' => 'brands/safecare.png',
                'is_active' => true,
            ],
            [
                'name' => 'MediTex',
                'slug' => 'meditex',
                'description' => 'Textile medis dengan standar kesehatan tinggi',
                'logo' => 'brands/meditex.png',
                'is_active' => true,
            ],
            [
                'name' => 'CarePlus',
                'slug' => 'careplus',
                'description' => 'Produk dengan nilai tambah untuk perawatan pasien',
                'logo' => 'brands/careplus.png',
                'is_active' => true,
            ],
        ];

        foreach ($brands as $brand) {
            ProductBrand::create($brand);
        }
    }
}
