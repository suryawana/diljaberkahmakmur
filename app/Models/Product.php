<?php

// app/Models/Product.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'specifications',
        'features',
        'main_image',
        'product_brand_id',
        'is_active',
        'whatsapp_message',
        'price',
        'is_available_online',
        'official_url',
        'availability_summary',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'is_available_online' => 'boolean',
        'specifications' => 'array',
        'features' => 'array',
        'availability_summary' => 'array',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        });

        $query->when($filters['category'] ?? false, function ($query, $category) {
            $query->whereHas('categories', function ($query) use ($category) {
                $query->where('slug', $category);
            });
        });

        $query->when($filters['brand'] ?? false, function ($query, $brand) {
            $query->whereHas('brand', function ($query) use ($brand) {
                $query->where('id', $brand);
            });
        });
    }

    public function brand()
    {
        return $this->belongsTo(ProductBrand::class, 'product_brand_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_category');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function getWhatsappUrlAttribute()
    {
        $message = $this->whatsapp_message ?: "Halo, saya tertarik dengan produk {$this->name}";
        $encodedMessage = urlencode($message);
        $company = Company::first();

        if ($company) {
            return "https://wa.me/{$company->whatsapp_number}?text={$encodedMessage}";
        }

        return '#';
    }

    public function getMainCategoryAttribute()
    {
        return $this->categories->first();
    }

    public function getAdditionalImagesAttribute()
    {
        return $this->images()->orderBy('order')->get();
    }
}
