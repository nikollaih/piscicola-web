<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

/**
 * Post
 *
 * @mixin Eloquent
 */
class Party extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'document',
        'name',
        'mobile_phone',
        'home_phone',
        'office_phone',
        'email',
        'notes',
        'productive_unit_id',
        'party_role_id'
    ];

    public function ProductiveUnit(){
        return $this->belongsTo(ProductiveUnit::class);
    }

    public function PartyRol(){
        return $this->belongsTo(PartyRole::class);
    }

    public function getAllByRole($partyRoleId) {
        $user = Auth::user();
        return Party::where('party_role_id', $partyRoleId)
            ->where('productive_unit_id', $user->productive_unit_id)
            ->orderBy('name', 'asc')
            ->paginate(20);
    }
}
