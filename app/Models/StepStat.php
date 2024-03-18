<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StepStat extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'step_id',
        'name',
        'key',
        'value_minimun',
        'value_maximun'
    ];

    public function Step() {
        return $this->belongsTo(Step::class);
    }

    public function getByKeyStep($key, $stepId) {
        return StepStat::where('key', $key)
            ->where('step_id', $stepId)
            ->first();
    }

    public function getAll($stepId) {
        if($stepId){
            return StepStat::orderBy('step_id', 'asc')
                ->where('step_id', $stepId)
                ->with('Step')
                ->paginate(20);
        }
        else {
            return StepStat::orderBy('step_id', 'asc')
                ->with('Step')
                ->paginate(20);
        }
    }
}
