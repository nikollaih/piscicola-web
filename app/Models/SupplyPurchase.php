<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplyPurchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'supply_id',
        'quantity',
        'price',
        'manual_created_at',
        'notes'
    ];

    public function getAll($supplyId) {
        return SupplyPurchase::select('supply_purchases.*', 'measurement_units.name as measurement_unit_name')
            ->where('supply_id', $supplyId)
            ->join('supplies', 'supply_id', '=', 'supplies.id')
            ->join('measurement_units', 'supplies.measurement_unit_id', '=', 'measurement_units.id')
            ->orderBy('supply_purchases.manual_created_at', 'desc')
            ->paginate(20);
    }

    public function Supply(){
        return $this->belongsTo(Supply::class);
    }
}
