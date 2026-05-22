<?php

// database/seeders/CategorySeeder.php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            // Parent Categories
            [
                'name' => 'Textile Rumah Sakit',
                'slug' => 'textile-rumah-sakit',
                'description' => 'Kain dan textile khusus untuk kebutuhan rumah sakit',
                'image' => 'categories/textile.jpg',
                'parent_id' => null,
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Furnitur Pasien',
                'slug' => 'furnitur-pasien',
                'description' => 'Furnitur khusus untuk kenyamanan pasien',
                'image' => 'categories/furnitur-pasien.jpg',
                'parent_id' => null,
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Furnitur Medis',
                'slug' => 'furnitur-medis',
                'description' => 'Furnitur untuk kebutuhan medis dan perawatan',
                'image' => 'categories/furnitur-medis.jpg',
                'parent_id' => null,
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Perlengkapan Kamar Pasien',
                'slug' => 'perlengkapan-kamar-pasien',
                'description' => 'Perlengkapan lengkap untuk kamar pasien',
                'image' => 'categories/kamar-pasien.jpg',
                'parent_id' => null,
                'order' => 4,
                'is_active' => true,
            ],

            // Subcategories untuk Textile Rumah Sakit
            [
                'name' => 'Baju Rumah Sakit',
                'slug' => 'baju-rumah-sakit',
                'description' => 'Seragam dokter, perawat, dan staff rumah sakit',
                'image' => 'categories/baju-rs.jpg',
                'parent_id' => 1,
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Seprei Rumah Sakit',
                'slug' => 'seprei-rumah-sakit',
                'description' => 'Seprei khusus untuk tempat tidur rumah sakit',
                'image' => 'categories/seprei.jpg',
                'parent_id' => 1,
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Gorden Rumah Sakit',
                'slug' => 'gorden-rumah-sakit',
                'description' => 'Gorden dan tirai untuk ruangan rumah sakit',
                'image' => 'categories/gorden.jpg',
                'parent_id' => 1,
                'order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Bed Cover',
                'slug' => 'bed-cover',
                'description' => 'Bed cover dan penutup tempat tidur pasien',
                'image' => 'categories/bed-cover.jpg',
                'parent_id' => 1,
                'order' => 4,
                'is_active' => true,
            ],

            // Subcategories untuk Furnitur Pasien
            [
                'name' => 'Tempat Tidur Pasien',
                'slug' => 'tempat-tidur-pasien',
                'description' => 'Tempat tidur khusus untuk pasien rumah sakit',
                'image' => 'categories/tempat-tidur.jpg',
                'parent_id' => 2,
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Kursi Pasien',
                'slug' => 'kursi-pasien',
                'description' => 'Kursi khusus untuk kenyamanan pasien',
                'image' => 'categories/kursi-pasien.jpg',
                'parent_id' => 2,
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Meja Pasien',
                'slug' => 'meja-pasien',
                'description' => 'Meja makan dan meja samping tempat tidur',
                'image' => 'categories/meja-pasien.jpg',
                'parent_id' => 2,
                'order' => 3,
                'is_active' => true,
            ],

            // Subcategories untuk Furnitur Medis
            [
                'name' => 'Kursi Dokter',
                'slug' => 'kursi-dokter',
                'description' => 'Kursi praktik dan konsultasi dokter',
                'image' => 'categories/kursi-dokter.jpg',
                'parent_id' => 3,
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Meja Operasi',
                'slug' => 'meja-operasi',
                'description' => 'Meja khusus untuk ruang operasi',
                'image' => 'categories/meja-operasi.jpg',
                'parent_id' => 3,
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Lemari Obat',
                'slug' => 'lemari-obat',
                'description' => 'Lemari penyimpanan obat dan alat medis',
                'image' => 'categories/lemari-obat.jpg',
                'parent_id' => 3,
                'order' => 3,
                'is_active' => true,
            ],

            // Subcategories untuk Perlengkapan Kamar Pasien
            [
                'name' => 'Locker Pasien',
                'slug' => 'locker-pasien',
                'description' => 'Locker penyimpanan barang pasien',
                'image' => 'categories/locker.jpg',
                'parent_id' => 4,
                'order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Tirai Pembatas',
                'slug' => 'tirai-pembatas',
                'description' => 'Tirai untuk pembatas ruangan pasien',
                'image' => 'categories/tirai-pembatas.jpg',
                'parent_id' => 4,
                'order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Stand Infus',
                'slug' => 'stand-infus',
                'description' => 'Stand dan holder untuk infus',
                'image' => 'categories/stand-infus.jpg',
                'parent_id' => 4,
                'order' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
