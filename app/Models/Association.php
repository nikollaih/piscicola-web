<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Association extends Model
{
    use HasFactory, SoftDeletes;

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

    public function getAll() {
        return Association::with('productiveUnits')->paginate(20);
    }
}
