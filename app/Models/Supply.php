<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Supply extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'measurement_unit_id',
        'productive_unit_id',
        'name',
        'use_type',
        'available_quantity',
        'notes'
    ];

    public function getAll() {
        $user = Auth::user();
        return Supply::where('productive_unit_id', $user->productive_unit_id)
                ->where('deleted_at', null)
                ->with('MeasurementUnit')
                ->paginate(20);
    }

    public function getAllByUse($use) {
        $user = Auth::user();
        return Supply::where('productive_unit_id', $user->productive_unit_id)
            ->where('use_type', $use)
            ->where('deleted_at', null)
            ->with('MeasurementUnit')
            ->get();
    }

    public function Use($supplyId, $quantity){
        $supply = Supply::find($supplyId);
        $newSupply["available_quantity"] = doubleval($supply->available_quantity) - doubleval($quantity);
        Supply::where('id', $supplyId)->update($newSupply);
    }

    public function modifyUse($supplyId, $oldQuantity, $newQuantity){
        $supply = Supply::find($supplyId);
        $newSupply["available_quantity"] = doubleval($supply->available_quantity) + doubleval($oldQuantity) - doubleval($newQuantity);
        Supply::where('id', $supplyId)->update($newSupply);
    }

    public function getCost($supplyId) {
        $supplyPurchase = SupplyPurchase::where('supply_id', $supplyId)->latest()->first();
        return round(doubleval($supplyPurchase->price) / doubleval($supplyPurchase->quantity));
    }

    public function ProductiveUnit(){
        return $this->belongsTo(ProductiveUnit::class);
    }

    public function MeasurementUnit(){
        return $this->belongsTo(MeasurementUnit::class);
    }
}
