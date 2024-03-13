<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SowingExpense extends Model
{
    use HasFactory;

    protected $fillable = [
        'sowing_id',
        'expense_id'
    ];

    public function Sowing() {
        return $this->belongsTo(Sowing::class);
    }

    public function Expense() {
        return $this->belongsTo(Expense::class);
    }
}
