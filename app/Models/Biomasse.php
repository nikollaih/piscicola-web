<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Biomasse extends Model
{
    use HasFactory;

    protected $fillable = [
        'sowing_id',
        'approximate_weight',
        'quantity_of_fish',
        'manual_created_at'
    ];


    public function Sowing(){
        return $this->belongsTo(Sowing::class);
    }

    public function Get($biomasseId) {
        return Biomasse::with('Sowing')
            ->find($biomasseId);
    }

    public function Latest($sowingId, $amount = 20) {
        return Biomasse::orderBy('manual_created_at', 'asc')
            ->with('Sowing')
            ->where('sowing_id', $sowingId)
            ->limit($amount)
            ->get();
    }

    public function Active($sowingId) {
        return Biomasse::with('Sowing')
            ->where('sowing_id', $sowingId)
            ->latest()
            ->first();
    }

    public function AllBySowing($sowingId) {
        return Biomasse::with('Sowing')
            ->where('sowing_id', $sowingId)
            ->orderBy('manual_created_at', 'desc')
            ->paginate(20);
    }

    public function AddFirst($sowingId){
        $biomasse = [
            'sowing_id' => $sowingId,
            'approximate_weight' => 25,
            'quantity_of_fish' => 1
        ];
        Biomasse::create($biomasse);
    }
}

