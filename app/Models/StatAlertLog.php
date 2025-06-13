<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StatAlertLog extends Model
{
    public $timestamps = true;

    protected $fillable = [
        'stats_reading_id',
        'stat_data',
        'emails',
        'counter',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
