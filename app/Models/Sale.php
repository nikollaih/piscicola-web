<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
      'sowing_id',
      'unit_cost',
      'total_weight',
      'manual_created_at'
    ];

    public function Sowing() {
        return $this->belongsTo(Sowing::class);
    }
}
