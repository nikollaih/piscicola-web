<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'document',
        'name',
        'mobile_phone',
        'email',
        'password',
        'role_id',
        'productive_unit_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];


    public function productiveUnit(){
        return $this->belongsTo(ProductiveUnit::class);
    }

    public function role(){
        return $this->belongsTo(Role::class);
    }

    public function getFCMTokens($productiveUnitId) {
        return User::where('productive_unit_id', $productiveUnitId)
            ->whereNotNull('fcm_token')
            ->where('active_push_notifications', 1)
            ->get();
    }
}
