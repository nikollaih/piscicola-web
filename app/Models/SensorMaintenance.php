<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class SensorMaintenance extends Model
{
    use SoftDeletes;

    protected $table = 'sensor_maintenances';

    protected $fillable = [
        'device_id',
        'operator_name',   // texto
        'maintenance_at',
        'next_maintenance_at',
        'observations',
        'evidence_path',
    ];

    protected $casts = [
        'maintenance_at' => 'datetime',
        'next_maintenance_at' => 'datetime',
    ];

    /**
     * Relación con Device
     */
    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    /**
     * Listado de mantenimientos, pero solo para devices que pertenezcan
     * a la unidad productiva del usuario logueado.
     */
    public function getAll()
    {
        $user = Auth::user();

        // Si por algún motivo el usuario no tiene productive_unit_id, devolvemos vacío paginado.
        if (! $user || ! isset($user->productive_unit_id)) {
            return self::whereRaw('0 = 1')->paginate(20);
        }

        $productiveUnitId = $user->productive_unit_id;

        return self::with('device')
            ->whereHas('device', function (Builder $q) use ($productiveUnitId) {
                $q->where('id_unidad_productiva', $productiveUnitId);
            })
            ->orderByDesc('maintenance_at')
            ->paginate(20);
    }

    /**
     * Obtener uno por id (cargando device y la unidad productiva relacionada)
     */
    public function getOne(int $id)
    {
        return self::with('device.productiveUnit')->findOrFail($id);
    }

    /**
     * Retorna el último mantenimiento de cada device, ordenados DESC por next_maintenance_at.
     * Si se provee $productiveUnitId, filtra por esa unidad productiva (vía device->productiveUnit).
     */
    public static function latestActivePerDeviceDesc(?int $productiveUnitId = null)
    {
        return self::query()
            // Asegura que el device exista y cumpla filtro de productive unit si se provee
            ->whereHas('device', function (Builder $q) use ($productiveUnitId) {
                if ($productiveUnitId) {
                    // Filtra dispositivos cuya unidad productiva tenga el id dado
                    $q->whereHas('productiveUnit', function (Builder $q2) use ($productiveUnitId) {
                        $q2->where('id', $productiveUnitId);
                    });
                }
            })
            // Carga device y su productiveUnit
            ->with(['device.productiveUnit'])
            // Toma el ÚLTIMO mantenimiento ACTIVO por cada device
            ->whereRaw("
                sensor_maintenances.id = (
                    SELECT sm2.id
                    FROM sensor_maintenances sm2
                    WHERE sm2.device_id = sensor_maintenances.device_id
                      AND sm2.deleted_at IS NULL
                    ORDER BY
                      (sm2.next_maintenance_at IS NULL) ASC,
                      sm2.next_maintenance_at DESC,
                      sm2.id DESC
                    LIMIT 1
                )
            ")
            ->orderByDesc('next_maintenance_at')
            ->get();
    }
}
