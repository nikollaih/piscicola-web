<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Pond extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'productive_unit_id',
        'name',
        'covered',
        'entrance',
        'exit',
        'volume',
        'area'
    ];

    public function ProductiveUnit() {
        return $this->belongsTo('ProductiveUnits');
    }

    public function isUsed($pondId) {
        return Sowing::where('pond_id', $pondId)
            ->exists();
    }

    public function getAll() {
        $user = Auth::user();

        return Pond::where('productive_unit_id', $user->productive_unit_id)
            ->paginate(20);
    }
}
