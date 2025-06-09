<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Sowing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'productive_unit_id',
        'fish_id',
        'step_id',
        'pond_id',
        'name',
        'sale_date',
        'quantity',
        'dead_quantity',
        'manual_created_at',
        'fecha_estimada'
    ];

    protected $sowingId = null;

    public function Sale() {
        return $this->hasOne(Sale::class);
    }

    public function Expenses() {
        return $this->belongsToMany(Expense::class, 'sowing_expenses');
    }

    public function setSowingId($sowingId) {
        $this->sowingId = $sowingId;
    }

    public function productiveUnit(){
        return $this->belongsTo(ProductiveUnit::class);
    }

    public function Fish(){
        return $this->belongsTo(Fish::class);
    }

    public function Step(){
        return $this->belongsTo(Step::class);
    }

    public function Pond(){
        return $this->belongsTo(Pond::class);
    }

    public function GetAll() {
        $user = Auth::user();
        return $sowings = Sowing::with('step')
            ->with('fish')
            ->with('pond')
            ->where('productive_unit_id', $user->productive_unit_id)
            ->orderBy('created_at', 'desc')
            ->paginate(50);
    }

    public function Get() {
        $user = Auth::user();
        return $sowings = Sowing::with('step')
            ->with('fish')
            ->with('pond')
            ->with('Sale')
            ->where('productive_unit_id', $user->productive_unit_id)
            ->find($this->sowingId);
    }

    public function getByPond($pondId) {
        return Sowing::where('pond_id', $pondId)
            ->whereNull('sale_date')
            ->first();
    }

    /**
     * Permite obtener una cosecha basandose en el id de la cosecha
     * @param $sowingId , el id de la cosecha
     */
    public static function getBasicInfoById($sowingId = -1)
    {
        return Sowing::with('step')
                ->with('fish')
                ->with('pond')
                ->with('Sale')
                ->where('id', $sowingId)
                ->whereNull('deleted_at')
                ->first();
    }
    /**
     * Permite obtener una cosecha basandose en su id y el id de la unidad productiva a la que pertenece
     * @param $sowingId , el id de la cosecha
     * @param $productiveUnitId, el id de la unidad productiva
     */
    public static function getBasicInfoByIdAndProductiveUnit($sowingId = -1,$productiveUnitId = -1)
    {
        return Sowing::with('step')
                ->with('fish')
                ->with('pond')
                ->with('Sale')
                ->where('id', $sowingId)
                ->where('productive_unit_id', $productiveUnitId)
                ->whereNull('deleted_at')
                ->first();
    }
}
