<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StatsReading extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sowing_id',
        'step_id',
        'step_stat_id',
        'biomasse_id',
        'value',
        'triggered_alarm',
        'topic_time'
    ];

    public function Step(){
        return $this->belongsTo(Step::class);
    }

    public function Sowing(){
        return $this->belongsTo(Sowing::class);
    }

    public function StepStat(){
        return $this->belongsTo(StepStat::class);
    }

    public function Biomasse(){
        return $this->belongsTo(Biomasse::class);
    }

    public function latest($sowingId) {
        return StatsReading::where('sowing_id', $sowingId)
            ->with('stepStat')
            ->whereIn('id', function($query) {
                $query->selectRaw('MAX(id)')
                    ->from('stats_readings')
                    ->groupBy('step_stat_id');
            })
            ->get();
    }

    public function latestByBiomasse($biomasseId) {
        return StatsReading::where('biomasse_id', $biomasseId)
            ->with('stepStat')
            ->with('stepStat.Step')
            ->whereIn('id', function($query) {
                $query->selectRaw('MAX(id)')
                    ->from('stats_readings')
                    ->groupBy('step_stat_id');
            })
            ->get();
    }

    public function GetByBiomasseStatReport($biomasseId, $stepStatId) {
        return StatsReading::selectRaw('value, IF(triggered_alarm = 1, "Si", "No") as triggered_alarm, topic_time')
            ->orderBy('topic_time', 'asc')
            ->where('biomasse_id', $biomasseId)
            ->where('step_stat_id', $stepStatId);
    }

    public function GetByBiomasseType($biomasseId, $stepStatId) {
        return StatsReading::where('biomasse_id', $biomasseId)
            ->where('step_stat_id', $stepStatId)
            ->with('stepStat')
            ->get();
    }
}
