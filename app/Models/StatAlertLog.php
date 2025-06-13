<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StatAlertLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'stats_reading_id',
        'stat_data',
        'emails',
        'counter',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];
}
