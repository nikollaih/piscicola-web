<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplyUse extends Model
{
    use HasFactory;

    protected $fillable = [
        'supply_id',
        'sowing_id',
        'biomasse_id',
        'unit_cost',
        'quantity',
        'manual_created_at'
    ];

    public function GetBySowingSuply($sowingId, $supplyId) {
        return SupplyUse::selectRaw('quantity, unit_cost, quantity * unit_cost AS total_cost, approximate_weight, supply_uses.manual_created_at')
            ->where('supply_uses.sowing_id', $sowingId)
            ->where('supply_id', $supplyId)
            ->join('biomasses', 'biomasses.id', '=', 'biomasse_id');
    }

    public function Get($id) {
         return SupplyUse::with('Supply.MeasurementUnit')
            ->with('Biomasse')
            ->with('Sowing')
            ->find($id);
    }

    public function getDifferentBySowing($sowingId = null, $useType = "ALIMENT") {
        return SupplyUse::where('sowing_id', $sowingId)
            ->with('Supply')
            ->with('Biomasse')
            ->whereIn('id', function($query) {
                $query->selectRaw('MAX(id)')
                    ->from('supply_uses')
                    ->groupBy('supply_id');
            })
            ->whereIn('supply_id', function($query) use ($useType) {
                $query->select('id')
                    ->from('supplies')
                    ->where('use_type', $useType);
            })
            ->get();
    }

    public function getAll($sowingId, $useType, $paginate = false) {
        if(!$paginate) {
            return SupplyUse::with('Supply.MeasurementUnit')
                ->with('Biomasse')
                ->with('Sowing')
                ->where('sowing_id', $sowingId)
                ->whereHas('Supply', function ($query) use ($useType) {
                    $query->where('use_type', $useType);
                })
                ->get();
        }
        else {
            return SupplyUse::orderBy('manual_created_at', 'desc')
                ->with('Supply.MeasurementUnit')
                ->with('Biomasse')
                ->with('Sowing')
                ->whereHas('Supply', function ($query) use ($useType) {
                    $query->where('use_type', $useType);
                })
                ->where('sowing_id', $sowingId)
                ->paginate(20);
        }

    }

    public function getBySupplyBiomasse($sowingId, $supplyId, $biomasseId) {
        return SupplyUse::with('Supply.MeasurementUnit')
            ->with('Biomasse')
            ->with('Sowing')
            ->where('sowing_id', $sowingId)
            ->whereHas('Biomasse', function ($query) use ($biomasseId) {
                $query->where('id', $biomasseId);
            })
            ->whereHas('Supply', function ($query) use ($supplyId) {
                $query->where('id', $supplyId);
            })
            ->get();
    }

    public function getSowingCost($sowingId, $useType){
        return SupplyUse::where('sowing_id', $sowingId)
            ->whereHas('Supply', function ($query) use ($useType) {
                $query->where('use_type', $useType);
            })
            ->sum(\DB::raw('unit_cost * quantity'));
    }

    public function Supply(){
        return $this->belongsTo(Supply::class);
    }

    public function Biomasse(){
        return $this->belongsTo(Biomasse::class);
    }

    public function Sowing(){
        return $this->belongsTo(Sowing::class);
    }
}
