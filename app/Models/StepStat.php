<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StepStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'key',
        'value_minimun',
        'value_maximum'
    ];

    public function Step() {
        return $this->belongsTo(Step::class);
    }
}
