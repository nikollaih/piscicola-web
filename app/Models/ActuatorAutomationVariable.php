<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActuatorAutomationVariable extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'actuator_id',
        'min_value',
        'max_value',
        'variable_key',
        'action'
    ];

    public function Get($actuatorId) {
        return ActuatorAutomationVariable::with('actuator')->where('actuator_id', $actuatorId)->first();
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
