<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Builder;

class SensorMaintenance extends Model
{
    use SoftDeletes;

    protected $table = 'sensor_maintenances';

    protected $fillable = [
        'pond_id',
        'sensor_name',     // texto
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

    public function pond()
    {
        return $this->belongsTo(Pond::class);
    }

    /** Listado SOLO de un Pond específico */
    public function getAllForPond(int $pondId)
    {
        return self::with('pond')
            ->where('pond_id', $pondId)
            ->orderByDesc('maintenance_at')
            ->paginate(20);
    }

    /** (Opcional) Obtener uno por id (no filtra por pond aquí) */
    public function getOne(int $id)
    {
        return self::with('pond.productiveUnit')->findOrFail($id);
    }

    /**
    * Retorna el último mantenimiento de cada pond, ordenados DESC por next_maintenance_at.
    * Si se provee $productiveUnitId, filtra por esa unidad productiva.
    */
    public static function latestActivePerPondDesc(?int $productiveUnitId = null)
    {
        return self::query()
            // Asegura que el pond exista y NO esté soft-deleted
            ->whereHas('pond', function (Builder $q) use ($productiveUnitId) {
                if ($productiveUnitId) {
                    $q->where('productive_unit_id', $productiveUnitId);
                }
            })
            // Carga pond y productiveUnit (solo activos por defecto)
            ->with(['pond.productiveUnit'])
            // Toma el ÚLTIMO mantenimiento ACTIVO por cada pond
            ->whereRaw("
            sensor_maintenances.id = (
                SELECT sm2.id
                FROM sensor_maintenances sm2
                WHERE sm2.pond_id = sensor_maintenances.pond_id
                  AND sm2.deleted_at IS NULL           -- solo activos
                ORDER BY
                  (sm2.next_maintenance_at IS NULL) ASC, -- no nulos primero
                  sm2.next_maintenance_at DESC,
                  sm2.id DESC
                LIMIT 1
            )
        ")
            // Orden final del resultado (colección) por fecha más reciente
            ->orderByDesc('next_maintenance_at')
            ->get();
    }
}
