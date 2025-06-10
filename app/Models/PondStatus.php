<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PondStatus extends Model
{
    use HasFactory;

    protected $table = 'ponds_status';

    protected $fillable = [
        'pond_id',
        'status',
        'event_date',
    ];

    public function pond()
    {
        return $this->belongsTo(Pond::class);
    }
}
