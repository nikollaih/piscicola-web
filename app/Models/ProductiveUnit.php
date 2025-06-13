<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductiveUnit extends Model
{
    use HasFactory, softDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'association_id',
        'name',
        'mobile_phone',
        'phone',
        'address',
        'email',
        'mqtt_id'
    ];

    public function association(){
        return $this->belongsTo(Association::class);
    }

    public function users(){
        return $this->hasMany(User::class);
    }

    public function Get($productiveUnitId) {
        return ProductiveUnit::with('Users')
            ->find($productiveUnitId);
    }

}
