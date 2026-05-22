<?php

// app/Models/ProductCategory.php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ProductCategory extends Pivot
{
    protected $table = 'product_category';

    public $incrementing = true;

    protected $fillable = [
        'product_id',
        'category_id',
    ];
}
