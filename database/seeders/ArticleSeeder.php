<?php

// database/seeders/ArticleSeeder.php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run()
    {
        $articles = [
            [
                'title' => 'Pentingnya Pemilihan Furnitur yang Tepat untuk Rumah Sakit',
                'slug' => 'pentingnya-pemilihan-furnitur-untuk-rumah-sakit',
                'content' => '<p>Furnitur rumah sakit bukan hanya tentang estetika, tetapi juga tentang kenyamanan, keamanan, dan fungsionalitas. Pemilihan furnitur yang tepat dapat mempengaruhi proses penyembuhan pasien dan efisiensi kerja tenaga medis.</p>
                <p>Beberapa faktor yang perlu dipertimbangkan dalam memilih furnitur rumah sakit:</p>
                <ul>
                    <li>Material yang mudah dibersihkan dan disinfeksi</li>
                    <li>Desain ergonomis untuk kenyamanan pasien dan staff</li>
                    <li>Daya tahan dan ketahanan terhadap penggunaan intensif</li>
                    <li>Kesesuaian dengan standar kesehatan dan keselamatan</li>
                </ul>',
                'image' => 'articles/furnitur-rs-1.jpg',
                'excerpt' => 'Pemilihan furnitur rumah sakit yang tepat dapat meningkatkan kenyamanan pasien dan efisiensi kerja tenaga medis.',
                'author' => 'Dr. Andi Wijaya',
                'published_at' => now()->subDays(5),
                'is_published' => true,
            ],
            [
                'title' => 'Trend Terkini dalam Desain Textile Rumah Sakit',
                'slug' => 'trend-terkini-desain-textile-rumah-sakit',
                'content' => '<p>Industri textile rumah sakit terus berkembang dengan inovasi-inovasi baru yang mengutamakan kenyamanan, keamanan, dan estetika.</p>
                <p>Beberapa trend terkini yang patut diperhatikan:</p>
                <ul>
                    <li>Penggunaan material anti-bakteri dan anti-microbial</li>
                    <li>Warna-warna calming untuk mengurangi stres pasien</li>
                    <li>Desain yang mudah dirawat dan tahan lama</li>
                    <li>Sustainability dan eco-friendly materials</li>
                </ul>',
                'image' => 'articles/textile-trend-1.jpg',
                'excerpt' => 'Inovasi dalam textile rumah sakit fokus pada kenyamanan, keamanan, dan keberlanjutan.',
                'author' => 'Sarah Medina, Textile Specialist',
                'published_at' => now()->subDays(2),
                'is_published' => true,
            ],
            [
                'title' => 'Tips Memilih Tempat Tidur Pasien yang Ideal',
                'slug' => 'tips-memilih-tempat-tidur-pasien-ideal',
                'content' => '<p>Tempat tidur pasien merupakan investasi penting bagi rumah sakit. Berikut tips memilih yang tepat:</p>
                <ol>
                    <li>Perhatikan kapasitas beban maksimal</li>
                    <li>Fitur keamanan seperti side rails</li>
                    <li>Kemudahan dalam perawatan dan pembersihan</li>
                    <li>Fungsi elektrik untuk penyesuaian posisi</li>
                    <li>Kenyamanan mattress dan bahan yang digunakan</li>
                </ol>',
                'image' => 'articles/tempat-tidur-ideal-1.jpg',
                'excerpt' => 'Pemilihan tempat tidur pasien yang tepat dapat mempercepat proses pemulihan dan meningkatkan kenyamanan.',
                'author' => 'Michael Chen, Hospital Equipment Expert',
                'published_at' => now()->subDays(1),
                'is_published' => true,
            ],
        ];

        foreach ($articles as $article) {
            Article::create($article);
        }
    }
}
