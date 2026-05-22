<?php

// database/seeders/MarketplaceSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MarketplaceSeeder extends Seeder
{
    public function run()
    {
        $marketplaces = [
            [
                'name' => 'Tokopedia',
                'slug' => 'tokopedia',
                'logo' => 'marketplaces/tokopedia.png',
                'url' => 'https://tokopedia.com/toko-kami',
                'description' => 'Beli produk kami di Tokopedia',
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Shopee',
                'slug' => 'shopee',
                'logo' => 'marketplaces/shopee.png',
                'url' => 'https://shopee.co.id/toko-kami',
                'description' => 'Beli produk kami di Shopee',
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Bukalapak',
                'slug' => 'bukalapak',
                'logo' => 'marketplaces/bukalapak.png',
                'url' => 'https://bukalapak.com/toko-kami',
                'description' => 'Beli produk kami di Bukalapak',
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Blibli',
                'slug' => 'blibli',
                'logo' => 'marketplaces/blibli.png',
                'url' => 'https://blibli.com/toko-kami',
                'description' => 'Beli produk kami di Blibli',
                'order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Lazada',
                'slug' => 'lazada',
                'logo' => 'marketplaces/lazada.png',
                'url' => 'https://lazada.co.id/toko-kami',
                'description' => 'Beli produk kami di Lazada',
                'order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Website Official',
                'slug' => 'official',
                'logo' => 'marketplaces/official.png',
                'url' => 'https://website-kami.com',
                'description' => 'Kunjungi website official kami',
                'order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Instagram',
                'slug' => 'instagram',
                'logo' => 'marketplaces/instagram.png',
                'url' => 'https://instagram.com/toko-kami',
                'description' => 'Follow kami di Instagram',
                'order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Facebook',
                'slug' => 'facebook',
                'logo' => 'marketplaces/facebook.png',
                'url' => 'https://facebook.com/toko-kami',
                'description' => 'Like halaman Facebook kami',
                'order' => 8,
                'is_active' => true,
            ],
        ];

        foreach ($marketplaces as $marketplace) {
            DB::table('marketplaces')->insert($marketplace);
        }
    }
}
