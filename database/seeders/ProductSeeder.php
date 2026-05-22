<?php

// database/seeders/ProductSeeder.php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            // Produk Textile
            [
                'name' => 'Baju Dokter White Coat',
                'slug' => 'baju-dokter-white-coat',
                'description' => 'Baju dokter putih klasik dengan bahan katun premium, nyaman digunakan untuk praktik sehari-hari. Dilengkapi dengan saku untuk alat tulis dan stetoskop.',
                'specifications' => [
                    'material' => 'Katun 100%',
                    'size' => ['S', 'M', 'L', 'XL', 'XXL'],
                    'color' => 'Putih',
                    'care' => 'Bisa dicuci dengan mesin',
                ],
                'features' => [
                    'Anti bakteri',
                    'Tahan luntur',
                    'Saku dalam dan luar',
                    'Jahitan kuat',
                ],
                'main_image' => 'products/baju-dokter-1.jpg',
                'product_brand_id' => 1,
                'is_active' => true,
                'whatsapp_message' => 'Halo, saya tertarik dengan Baju Dokter White Coat',
                'categories' => [5], // Baju Rumah Sakit
            ],
            [
                'name' => 'Seragam Perawat Modern',
                'slug' => 'seragam-perawat-modern',
                'description' => 'Seragam perawat dengan desain modern, bahan nyaman, dan praktis untuk aktivitas perawat yang padat. Tersedia dalam berbagai ukuran.',
                'specifications' => [
                    'material' => 'Polycotton',
                    'size' => ['XS', 'S', 'M', 'L', 'XL'],
                    'color' => ['Biru', 'Putih', 'Hijau'],
                    'care' => 'Easy care, tidak perlu disetrika',
                ],
                'features' => [
                    'Bahan adem',
                    'Tidak mudah kusut',
                    'Saku multifungsi',
                    'Desain ergonomis',
                ],
                'main_image' => 'products/seragam-perawat-1.jpg',
                'product_brand_id' => 1,
                'is_active' => true,
                'whatsapp_message' => 'Halo, saya tertarik dengan Seragam Perawat Modern',
                'categories' => [5], // Baju Rumah Sakit
            ],
            [
                'name' => 'Seprei Waterproof Rumah Sakit',
                'slug' => 'seprei-waterproof-rumah-sakit',
                'description' => 'Seprei khusus rumah sakit dengan lapisan waterproof, mudah dibersihkan, dan nyaman untuk pasien. Tahan terhadap cairan dan noda.',
                'specifications' => [
                    'material' => 'Katun dengan coating PVC',
                    'size' => ['90x200', '100x200', '120x200'],
                    'color' => ['Putih', 'Biru muda', 'Hijau muda'],
                    'waterproof' => 'Yes',
                ],
                'features' => [
                    'Anti bakteri',
                    'Waterproof',
                    'Mudah dibersihkan',
                    'Tahan lama',
                ],
                'main_image' => 'products/seprei-waterproof-1.jpg',
                'product_brand_id' => 4,
                'is_active' => true,
                'whatsapp_message' => 'Halo, saya tertarik dengan Seprei Waterproof Rumah Sakit',
                'categories' => [6], // Seprei Rumah Sakit
            ],
            [
                'name' => 'Gorden Ruang Operasi',
                'slug' => 'gorden-ruang-operasi',
                'description' => 'Gorden khusus untuk ruang operasi dengan bahan heavy duty, tahan lama, dan memenuhi standar kebersihan rumah sakit.',
                'specifications' => [
                    'material' => 'Vinyl coated polyester',
                    'size' => 'Custom',
                    'color' => ['Biru', 'Hijau'],
                    'fire_rating' => 'Class 1',
                ],
                'features' => [
                    'Tahan api',
                    'Easy to clean',
                    'Anti bakteri',
                    'Heavy duty',
                ],
                'main_image' => 'products/gorden-operasi-1.jpg',
                'product_brand_id' => 4,
                'is_active' => true,
                'whatsapp_message' => 'Halo, saya tertarik dengan Gorden Ruang Operasi',
                'categories' => [7], // Gorden Rumah Sakit
            ],

            // Produk Furnitur
            [
                'name' => 'Tempat Tidur Pasien Elektrik',
                'slug' => 'tempat-tidur-pasien-elektrik',
                'description' => 'Tempat tidur pasien dengan kontrol elektrik, dapat diatur posisi kepala dan kaki secara otomatis. Dilengkapi dengan side rail pengaman.',
                'specifications' => [
                    'material' => 'Stainless steel frame',
                    'mattress_size' => '90x200 cm',
                    'max_weight' => '200 kg',
                    'power' => 'AC 220V',
                ],
                'features' => [
                    'Kontrol elektrik',
                    'Side rail pengaman',
                    'IV pole holder',
                    'Brake system',
                ],
                'main_image' => 'products/tempat-tidur-elektrik-1.jpg',
                'product_brand_id' => 2,
                'is_active' => true,
                'whatsapp_message' => 'Halo, saya tertarik dengan Tempat Tidur Pasien Elektrik',
                'categories' => [9], // Tempat Tidur Pasien
            ],
            [
                'name' => 'Kursi Pasien dengan Roda',
                'slug' => 'kursi-pasien-dengan-roda',
                'description' => 'Kursi pasien yang dilengkapi dengan roda untuk memudahkan mobilisasi pasien. Nyaman dan aman dengan sandaran yang dapat disesuaikan.',
                'specifications' => [
                    'material' => 'Stainless steel',
                    'seat_material' => 'Vinyl waterproof',
                    'features' => ['Roda', 'Footrest', 'Adjustable back'],
                ],
                'features' => [
                    'Mudah bermanuver',
                    'Bahan waterproof',
                    'Adjustable',
                    'Storage pouch',
                ],
                'main_image' => 'products/kursi-pasien-roda-1.jpg',
                'product_brand_id' => 3,
                'is_active' => true,
                'whatsapp_message' => 'Halo, saya tertarik dengan Kursi Pasien dengan Roda',
                'categories' => [10], // Kursi Pasien
            ],
            [
                'name' => 'Meja Makan Pasien',
                'slug' => 'meja-makan-pasien',
                'description' => 'Meja makan khusus pasien yang dapat disesuaikan tinggi dan posisinya. Praktis dan mudah disimpan.',
                'specifications' => [
                    'material' => 'Plastic dan stainless steel',
                    'size' => '40x60 cm',
                    'adjustable' => 'Yes',
                    'foldable' => 'Yes',
                ],
                'features' => [
                    'Adjustable height',
                    'Foldable',
                    'Easy to clean',
                    'Non-slip surface',
                ],
                'main_image' => 'products/meja-makan-pasien-1.jpg',
                'product_brand_id' => 3,
                'is_active' => true,
                'whatsapp_message' => 'Halo, saya tertarik dengan Meja Makan Pasien',
                'categories' => [11], // Meja Pasien
            ],

            // Produk Medis
            [
                'name' => 'Kursi Dokter Konsultasi',
                'slug' => 'kursi-dokter-konsultasi',
                'description' => 'Kursi ergonomis untuk dokter dengan desain profesional, nyaman untuk praktik konsultasi sehari-hari.',
                'specifications' => [
                    'material' => 'Leather synthetic',
                    'frame' => 'Stainless steel',
                    'features' => ['Adjustable height', 'Swivel', 'Arm rest'],
                ],
                'features' => [
                    'Ergonomis',
                    'Adjustable',
                    'Mudah dibersihkan',
                    'Durable',
                ],
                'main_image' => 'products/kursi-dokter-1.jpg',
                'product_brand_id' => 2,
                'is_active' => true,
                'whatsapp_message' => 'Halo, saya tertarik dengan Kursi Dokter Konsultasi',
                'categories' => [12], // Kursi Dokter
            ],
            [
                'name' => 'Lemari Obat Stainless Steel',
                'slug' => 'lemari-obat-stainless-steel',
                'description' => 'Lemari penyimpanan obat dengan bahan stainless steel, mudah dibersihkan, dan memenuhi standar farmasi.',
                'specifications' => [
                    'material' => 'Stainless steel 304',
                    'size' => '180x90x45 cm',
                    'shelves' => '5 adjustable shelves',
                    'lock' => 'Key lock',
                ],
                'features' => [
                    'Anti karat',
                    'Adjustable shelves',
                    'Easy to clean',
                    'Security lock',
                ],
                'main_image' => 'products/lemari-obat-1.jpg',
                'product_brand_id' => 2,
                'is_active' => true,
                'whatsapp_message' => 'Halo, saya tertarik dengan Lemari Obat Stainless Steel',
                'categories' => [14], // Lemari Obat
            ],
        ];

        foreach ($products as $productData) {
            $categories = $productData['categories'];
            unset($productData['categories']);

            $product = Product::create($productData);
            $product->categories()->attach($categories);

            // Add sample images for each product
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => str_replace('-1.', '-2.', $productData['main_image']),
                'order' => 1,
                'alt_text' => $productData['name'].' - Gambar 2',
            ]);

            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => str_replace('-1.', '-3.', $productData['main_image']),
                'order' => 2,
                'alt_text' => $productData['name'].' - Gambar 3',
            ]);
        }
    }
}
