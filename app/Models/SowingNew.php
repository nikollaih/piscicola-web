<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SowingNew extends Model
{
    use HasFactory;

    protected $fillable = [
        'sowing_id',
        'description',
        'title'
    ];

    public function getAll($sowingId, $type = null) {
        $query = SowingNew::where('sowing_id', $sowingId)
            ->with('Sowing')
            ->orderBy('created_at', 'desc');

        if (!is_null($type)) {
            $query->where('title', $type);
        }

        return $query->paginate(20);
    }

    public function Sowing() {
        return $this->belongsTo(Sowing::class);
    }
}
