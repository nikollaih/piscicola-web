<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActuatorUse extends Model
{
    use HasFactory;

    protected $fillable = [
        'actuator_id',
        'biomasse_id',
        'turned_on',
        'turned_off',
        'minutes',
        'cost'
    ];

    public function Actuator() {
        return $this->belongsTo(Actuator::class);
    }

    public function Biomasse() {
        return $this->belongsTo(Biomasse::class);
    }

    public function Get($actuatorId) {
        return ActuatorUse::where('actuator_id', $actuatorId)
            ->orderBy('created_at', 'desc')
            ->first();
    }

    public function getAll($actuatorId, $paginate = 20) {
        $query = ActuatorUse::orderBy("created_at", "desc")
            ->with('Actuator')
            ->where('actuator_id', $actuatorId)
            ->whereNotNull('turned_off')
            ->whereNotNull('cost')
            ->whereNotNull('minutes');

        return $query->when($paginate, function ($query) use ($paginate) {
            return $query->paginate($paginate);
        }, function ($query) {
            return $query->get();
        });
    }

    public function getSowingCost($sowingId){
        return ActuatorUse::selectRaw('actuator_id, SUM(cost) as total_cost, actuators.name as name')
            ->groupBy('actuator_id','actuators.name')
            ->leftJoin('actuators', 'actuators.id', '=', 'actuator_id')
            ->with('Biomasse')
            ->whereHas('Biomasse', function ($query) use ($sowingId) {
                $query->where('sowing_id', $sowingId);
            })
            ->whereNotNull('turned_off')
            ->whereNotNull('cost')
            ->whereNotNull('minutes')
            ->get();
    }
}
