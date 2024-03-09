<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductiveUnit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'mobile_phone',
        'phone',
        'address',
        'email'
    ];

    public function association(){
        return $this->belongsTo(Association::class);
    }

    public function users(){
        return $this->hasMany(User::class);
    }

}
