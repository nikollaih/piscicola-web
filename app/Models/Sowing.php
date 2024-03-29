<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Sowing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'productive_unit_id',
        'fish_id',
        'step_id',
        'pond_id',
        'name',
        'sale_date',
        'quantity',
        'dead_quantity',
        'manual_created_at'
    ];

    protected $sowingId = null;

    public function Sale() {
        return $this->hasOne(Sale::class);
    }

    public function Expenses() {
        return $this->belongsToMany(Expense::class, 'sowing_expenses');
    }

    public function setSowingId($sowingId) {
        $this->sowingId = $sowingId;
    }

    public function productiveUnit(){
        return $this->belongsTo(ProductiveUnit::class);
    }

    public function Fish(){
        return $this->belongsTo(Fish::class);
    }

    public function Step(){
        return $this->belongsTo(Step::class);
    }

    public function Pond(){
        return $this->belongsTo(Pond::class);
    }

    public function GetAll() {
        $user = Auth::user();
        return $sowings = Sowing::with('step')
            ->with('fish')
            ->with('pond')
            ->where('productive_unit_id', $user->productive_unit_id)
            ->paginate(50);
    }

    public function Get() {
        $user = Auth::user();
        return $sowings = Sowing::with('step')
            ->with('fish')
            ->with('pond')
            ->with('Sale')
            ->where('productive_unit_id', $user->productive_unit_id)
            ->find($this->sowingId);
    }

    public function getByPond($pondId) {
        return Sowing::where('pond_id', $pondId)
            ->whereNull('sale_date')
            ->first();
    }
}
