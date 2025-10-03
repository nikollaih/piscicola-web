<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mortality extends Model
{
    use HasFactory;

    protected $fillable = [
        'biomasse_id',
        'dead',
        'manual_created_at'
    ];

    public function Biomasse() {
        return $this->belongsTo(Biomasse::class);
    }

    public function Get($biomasseId) {
        return Mortality::with('Biomasse')
            ->with('Biomasse.Sowing')
            ->find($biomasseId);
    }

    public function getByBiomasse($biomasseId) {
        return Mortality::with('Biomasse')
            ->with('Biomasse.Sowing')
            ->where('biomasse_id', $biomasseId)
            ->get();
    }

    public function Latest($sowingId, $amount = 20) {
        return Mortality::orderBy('manual_created_at', 'asc')
            ->with('Biomasse')
            ->with('Biomasse.Sowing')
            ->whereHas('Biomasse', function ($query) use ($sowingId) {
                $query->where('sowing_id', $sowingId);
            })
            ->limit($amount)
            ->get();
    }

    public function AllBySowing($sowingId) {
        return Mortality::orderBy('manual_created_at', 'desc')
            ->with('Biomasse')
            ->with('Biomasse.Sowing')
            ->whereHas('Biomasse', function ($query) use ($sowingId) {
                $query->where('sowing_id', $sowingId);
            })
            ->paginate(20);
    }
}
