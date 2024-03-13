<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Actuator extends Model
{
    use HasFactory, softDeletes;

    protected $fillable = [
        'pond_id',
        'name',
        'actuator_type_id',
        'description',
        'cost_by_minute'
    ];

    public function Pond() {
        return $this->belongsTo(Pond::class);
    }

    public function ActuatorType() {
        return $this->belongsTo(ActuatorType::class);
    }

    public function Get($actuatorId) {
        return Actuator::with('Pond')
            ->with('ActuatorType')
            ->find($actuatorId);
    }

    public function getAll($pondId = null) {
        if($pondId) {
            return Actuator::where('pondId')
                ->with('Pond')
                ->with('ActuatorType')
                ->paginate(20);
        }
        else {
            return Actuator::with('Pond')
                ->with('ActuatorType')
                ->paginate(20);
        }
    }
}
