<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\ArticleController as ControllersArticleController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController as ControllersCategoryController;
use App\Http\Controllers\Dashboard\ArticleController;
use App\Http\Controllers\Dashboard\CategoryController;
use App\Http\Controllers\Dashboard\CompanyController;
use App\Http\Controllers\Dashboard\MarketplaceController;
use App\Http\Controllers\Dashboard\ProductBrandController;
use App\Http\Controllers\Dashboard\ProductController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController as ControllersProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::post('/chatbot', [ChatbotController::class, 'chat'])->name('chatbot.chat');
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products', [ControllersProductController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [ControllersProductController::class, 'show'])->name('products.show');
Route::get('/categories', [ControllersCategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{category:slug}', [ControllersCategoryController::class, 'show'])->name('categories.show');
Route::get('/about', [AboutController::class, 'index'])->name('about');

Route::get('/articles', [ControllersArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/{slug}', [ControllersArticleController::class, 'show'])->name('articles.show');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return redirect('/dashboard/company');

        return Inertia::render('dashboard');
    })->name('dashboard');
});
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/brands', [BrandController::class, 'index'])->name('brands.index');
    Route::get('/brands/create', [BrandController::class, 'create'])->name('brands.create');
    Route::post('/brands', [BrandController::class, 'store'])->name('brands.store');
    Route::get('/brands/{brand}/edit', [BrandController::class, 'edit'])->name('brands.edit');
    Route::post('/brands/{brand}', [BrandController::class, 'update'])->name('brands.update');
    Route::delete('/brands/{brand}', [BrandController::class, 'destroy'])->name('brands.destroy');
});
// Dashboard Routes
Route::prefix('dashboard')->as('dashboard.')->group(function () {
    // Company - hanya edit dan update
    Route::get('/marketplaces', [MarketplaceController::class, 'index']);
    Route::get('/marketplaces/create', [MarketplaceController::class, 'create']);
    Route::post('/marketplaces', [MarketplaceController::class, 'store']);
    Route::get('/marketplaces/{marketplace}/edit', [MarketplaceController::class, 'edit']);
    Route::delete('/marketplaces/{marketplace}', [MarketplaceController::class, 'destroy']);
    Route::post('/marketplaces/{marketplace}/update', [MarketplaceController::class, 'update']);

    Route::get('/company', [CompanyController::class, 'edit'])->name('companies.edit');
    Route::post('/company', [CompanyController::class, 'update'])->name('companies.update');
    Route::delete('/company/logo', [CompanyController::class, 'deleteLogo'])->name('companies.logo.delete');
    Route::delete('/company/favicon', [CompanyController::class, 'deleteFavicon'])->name('companies.favicon.delete');

    Route::post('/marketplaces/{marketplace}', [MarketplaceController::class, 'update']);
    Route::resource('categories', CategoryController::class);
    Route::delete('/categories/{category}/image', [CategoryController::class, 'deleteImage'])
        ->name('categories.image.delete');

    Route::post('/brands/{brand}', [ProductBrandController::class, 'update']);
    Route::resource('brands', ProductBrandController::class)->except(['update']);
    Route::delete('/brands/{brand}/logo', [ProductBrandController::class, 'deleteLogo'])
        ->name('brands.logo.delete');

    Route::post('/products/{product}', [ProductController::class, 'update'])
        ->name('products.update');
    Route::resource('products', ProductController::class)->except(['update']);
    Route::delete('/products/{product}/main-image', [ProductController::class, 'deleteMainImage'])
        ->name('products.main-image.delete');
    Route::delete('/products/{productImage}/additional-image', [ProductController::class, 'deleteAdditionalImage'])
        ->name('products.additional-image.delete');

    Route::post('/articles/{article}', [ArticleController::class, 'update'])
        ->name('articles.update');
    Route::resource('articles', ArticleController::class)->except(['update']);
    Route::delete('/articles/{article}/image', [ArticleController::class, 'deleteImage'])
        ->name('dashboard.articles.image.delete');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
