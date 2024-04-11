<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditorMqttConnection extends Model
{
    use HasFactory;

    protected $fillable = [
        "register_time",
        "status",
        "failed"
    ];
}
