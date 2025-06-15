<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reconnection extends Model
{
    use HasFactory;

    protected $fillable = [
        'productive_unit_id',
        'last_connection_date',
        'reconnection_date',
        'duration'
    ];

    public function productiveUnit()
    {
        return $this->belongsTo(ProductiveUnit::class);
    }
}
