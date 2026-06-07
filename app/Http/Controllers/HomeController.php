<?php

// app/Http/Controllers/HomeController.php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Company;
use App\Models\Marketplace;
use App\Models\Product;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Ambil data company
        $company = Company::first();

        // Ambil produk featured (max 8 produk)
        $featuredProducts = Product::with(['brand', 'categories', 'images'])
            ->active()
            ->latest()
            ->take(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'description' => $product->description,
                    'price' => $product->price,
                    'main_image' => $product->main_image,
                    'brand' => $product->brand?->name,
                    'categories' => $product->categories->pluck('name'),
                    'whatsapp_url' => $product->whatsapp_url,
                ];
            });

        // Ambil kategori utama (parent categories)
        $mainCategories = Category::with(['children'])
            ->whereNull('parent_id')
            ->active()
            ->ordered()
            ->take(6)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'image' => $category->image,
                    'children_count' => $category->children->count(),
                ];
            });

        // Ambil artikel terbaru
        $latestArticles = Article::latest()
            ->take(3)
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'slug' => $article->slug,
                    'excerpt' => $article->excerpt,
                    'image' => $article->image,
                    'author' => $article->author,
                    'published_at' => $article->published_at->format('d M Y'),
                    'read_time' => ceil(str_word_count(strip_tags($article->content)) / 200).' min read',
                ];
            });

        // Ambil brands/partners
        $partners = Brand::query()
            ->get()
            ->map(function ($brand) {
                return [
                    'id' => $brand->id,
                    'name' => $brand->name,
                    'logo' => $brand->logo,
                    'description' => $brand->description,
                    'website' => $brand->website,
                ];
            });

        // Ambil marketplaces
        $marketplaces = Marketplace::active()
            ->ordered()
            ->get()
            ->map(function ($marketplace) {
                return [
                    'id' => $marketplace->id,
                    'name' => $marketplace->name,
                    'slug' => $marketplace->slug,
                    'logo' => $marketplace->logo,
                    'url' => $marketplace->url,
                    'description' => $marketplace->description,
                    'color' => $marketplace->color,
                ];
            });

        return Inertia::render('Home/Index', [
            'company' => $company ? [
                'name' => $company->name,
                'about' => $company->about,
                'description' => $company->description,
                'logo' => $company->logo,
                'whatsapp_number' => $company->whatsapp_number,
                'whatsapp_message' => $company->whatsapp_message,
                'whatsapp_url' => $company->whatsapp_url,
                'phone' => $company->phone,
                'email' => $company->email,
                'address' => $company->address,
                'social_media' => $company->social_media,
            ] : null,
            'featuredProducts' => $featuredProducts,
            'mainCategories' => $mainCategories,
            'latestArticles' => $latestArticles,
            'partners' => $partners,
            'marketplaces' => $marketplaces,
            'stats' => [
                'products_count' => Product::active()->count(),
                'categories_count' => Category::active()->count(),
                'partners_count' => Brand::active()->count(),
                'experience_years' => 10, // Sesuaikan dengan data company
            ],
        ]);
    }
}
