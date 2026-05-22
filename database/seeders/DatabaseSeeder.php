<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $this->call([
            // CompanySeeder::class,
            // CategorySeeder::class,
            // ProductBrandSeeder::class,
            // BrandSeeder::class,
            // MarketplaceSeeder::class, // Dari sebelumnya
            // ProductSeeder::class,
            // ArticleSeeder::class,
        ]);
    }
}
