<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SowingNew extends Model
{
    use HasFactory;

    protected $fillable = [
        'sowing_id',
        'user_id',
        'description',
        'title'
    ];

    public function getAll($sowingId) {
        return SowingNew::where('sowing_id', $sowingId)
            ->orderBy('created_at', 'desc')
            ->with('Sowing')
            ->paginate(20);
    }

    public function Sowing() {
        return $this->belongsTo(Sowing::class);
    }

    public function User() {
        return $this->belongsTo(User::class);
    }
}
