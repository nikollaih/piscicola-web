<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Association extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'mobile_phone',
        'phone',
        'address',
        'email'
    ];

    public function productiveUnits(){
        return $this->hasMany(ProductiveUnit::class);
    }
}
