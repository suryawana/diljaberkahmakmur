<?php

// app/Models/Company.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'about',
        'phone',
        'email',
        'address',
        'logo',
        'favicon',
        'description',
        'whatsapp_number',
        'whatsapp_message',
        'social_media',
    ];

    protected $casts = [
        'social_media' => 'array',
    ];

    public function getWhatsappUrlAttribute()
    {
        $message = $this->whatsapp_message ?: 'Halo, saya tertarik dengan produk Anda';
        $encodedMessage = urlencode($message);

        return "https://wa.me/{$this->whatsapp_number}?text={$encodedMessage}";
    }
}
