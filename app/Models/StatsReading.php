<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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

    public function Get($statReadingId) {
        return StatsReading::with('StepStat')
            ->with('StepStat.Step')
            ->find($statReadingId);
    }

    public function latest($sowingId, $stepId = null) {
        return StatsReading::where('sowing_id', $sowingId)
            ->with('stepStat')
            ->with('stepStat.Step')
            ->whereHas('stepStat', function ($query) use ($stepId) {
                if ($stepId) {
                    $query->where('step_id', $stepId);
                }
            })
            ->whereIn('id', function($query) use ($sowingId) {
                $query->selectRaw('MAX(id)')
                    ->from('stats_readings')
                    ->where('sowing_id', $sowingId) // 👈 FILTRAR AQUÍ
                    ->groupBy('step_stat_id');
            })
            ->get();
    }

    public function latestGeneral() {
        return StatsReading::with('stepStat.step')
            ->whereIn('id', function($query) {
                $query->selectRaw('MAX(id)')
                    ->from('stats_readings')
                    ->groupBy('sowing_id');
            })
            ->get();
    }

    public function latestByBiomasse($biomasseId) {
        return StatsReading::where('biomasse_id', $biomasseId)
            ->with('stepStat.step') // puedes encadenar con punto
            ->whereIn('id', function($query) use ($biomasseId) {
                $query->selectRaw('MAX(id)')
                    ->from('stats_readings')
                    ->where('biomasse_id', $biomasseId)
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
            ->orderBy('topic_time', 'desc')
            ->take(100)
            ->get();
    }

    public static function getReadingsBetweenDates($sowingId = -1,$fromDate = -1,$toDate = -1){
        return DB::table('stats_readings', 'stats_reading')
        ->where('stats_reading.sowing_id', $sowingId)
        ->leftJoin('steps as step', 'step.id', '=', 'stats_reading.step_id')
        ->where('step.deleted_at', null)
        ->leftJoin('step_stats as step_stat','step_stat.id','=','stats_reading.step_stat_id')
        ->where('step_stat.deleted_at', null)
        ->select('stats_reading.*','step.name as stepName','step_stat.key as measurementUnit', 'step_stat.name as statName')
        ->get();
    }
}
