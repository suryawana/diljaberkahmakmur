<?php

// database/seeders/BrandSeeder.php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run()
    {
        $brands = [
            [
                'name' => 'Ministry of Health Indonesia',
                'logo' => 'partners/kemenkes.png',
                'description' => 'Kementerian Kesehatan Republik Indonesia',
                'website' => 'https://www.kemkes.go.id',
                'is_active' => true,
                'order' => 1,
            ],
            [
                'name' => 'Rumah Sakit Cipto Mangunkusumo',
                'logo' => 'partners/rs-cm.png',
                'description' => 'Rumah Sakit Umum Pusat Nasional',
                'website' => 'https://www.rscm.co.id',
                'is_active' => true,
                'order' => 2,
            ],
            [
                'name' => 'Mayapada Hospital',
                'logo' => 'partners/mayapada.png',
                'description' => 'Jaringan Rumah Sakit Swasta Terkemuka',
                'website' => 'https://www.mayapadahospital.com',
                'is_active' => true,
                'order' => 3,
            ],
            [
                'name' => 'Siloam Hospitals',
                'logo' => 'partners/siloam.png',
                'description' => 'Jaringan Rumah Sakit Internasional',
                'website' => 'https://www.siloamhospitals.com',
                'is_active' => true,
                'order' => 4,
            ],
            [
                'name' => 'Medikaloka',
                'logo' => 'partners/medikaloka.png',
                'description' => 'Supplier Alat Kesehatan Terpercaya',
                'website' => 'https://www.medikaloka.co.id',
                'is_active' => true,
                'order' => 5,
            ],
        ];

        foreach ($brands as $brand) {
            Brand::create($brand);
        }
    }
}
