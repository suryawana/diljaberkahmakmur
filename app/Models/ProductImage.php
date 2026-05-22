<?php

// app/Models/ProductImage.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'image_path',
        'order',
        'alt_text',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    protected function altText(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ?: $this->product->name.' - Gambar '.($this->order + 1),
        );
    }
}
