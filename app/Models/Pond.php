<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Pond extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'productive_unit_id',
        'name',
        'covered',
        'entrance',
        'exit',
        'volume',
        'area',
        'mqtt_id'
    ];

    public function productiveUnit()
    {
        return $this->belongsTo(ProductiveUnit::class);
    }

    public function isUsed($pondId) {
        return Sowing::where('pond_id', $pondId)
            ->exists();
    }

    public function getAll() {
        $user = Auth::user();
        return Pond::where('productive_unit_id', $user->productive_unit_id)
            ->with('latestStatus')
            ->paginate(20);
    }

    public function getPondMQTT($pondMQTT, $productiveUnitMQTT) {
        return Pond::select('ponds.*')
            ->join('productive_units', 'productive_units.id', '=', 'ponds.productive_unit_id')
            ->where('ponds.mqtt_id', $pondMQTT)
            ->where('productive_units.mqtt_id', $productiveUnitMQTT)
            ->first();
    }

    public function latestStatus()
    {
        return $this->hasOne(PondStatus::class)->latestOfMany('event_date');
    }
}
