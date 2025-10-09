<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
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

    public function latestMaintenance()
    {
        return $this->hasOne(SensorMaintenance::class, 'device_id')
            ->whereNull('deleted_at')
            ->orderByRaw('(next_maintenance_at IS NULL) ASC')
            ->orderByDesc('next_maintenance_at')
            ->orderByDesc('id');
    }

    public function getAllWithLatestMaintenance()
    {
        $user = Auth::user();

        if (! $user || ! isset($user->productive_unit_id)) {
            // devuelve paginado vacío para mantener la misma interfaz
            return self::whereRaw('0 = 1')->paginate(20);
        }

        return self::with(['pond', 'latestMaintenance'])
            ->where('id_unidad_productiva', $user->productive_unit_id)
            ->paginate(100);
    }
}
