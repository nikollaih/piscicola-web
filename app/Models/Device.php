<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Device extends Model
{
    use SoftDeletes;

    protected $table = 'devices';

    protected $fillable = [
        'id_unidad_productiva',
        'name',
        'category',
        'maintenance_period',
        'pond_id',
        'description',
    ];

    // Relación con ProductiveUnit
    public function productiveUnit()
    {
        return $this->belongsTo(ProductiveUnit::class, 'id_unidad_productiva');
    }

    public function getAll() {
        $user = Auth::user();

        return Device::with('pond') // carga la relación solo si existe pond_id
        ->where('id_unidad_productiva', $user->productive_unit_id)
            ->paginate(20);
    }

    public function get($deviceId) {
        return Device::where('id', $deviceId)->first();
    }

    public function pond()
    {
        return $this->belongsTo(Pond::class, 'pond_id');
    }
}
