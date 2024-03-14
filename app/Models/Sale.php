<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
      'sowing_id',
        'client_id',
      'unit_cost',
      'total_weight',
      'manual_created_at'
    ];

    public function Sowing() {
        return $this->belongsTo(Sowing::class);
    }

    public function Client() {
        return $this->belongsTo(Party::class);
    }

    public function Get($saleId) {
        return Sale::with('Client')
            ->find($saleId);
    }

    public function getAll() {
        return Sale::orderBy('manual_created_at', 'desc')
            ->with('Client')
            ->paginate(20);
    }
}
