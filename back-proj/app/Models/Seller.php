<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'shop_name',
        'email',
        'id_type',
        'id_number',
        'house_and_ward',
        'district_and_province',
        'photo_id',
        'phone_number',
        'last_updated_at',
    ];
    protected $casts = [
        'last_updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

