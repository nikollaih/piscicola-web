<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartyRole extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    public function Parties() {
        return $this->hasMany(Party::class);
    }
}
