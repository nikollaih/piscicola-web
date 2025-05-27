<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActuatorAutomationTime extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'actuator_id',
        'start_time',
        'end_time',
    ];

    public function Get($actuatorId) {
        return ActuatorAutomationTime::with('actuator')->where('actuator_id', $actuatorId)->first();
    }

    public function actuator()
    {
        return $this->belongsTo(Actuator::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
