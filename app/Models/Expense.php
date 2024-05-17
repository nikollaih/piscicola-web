<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpSpreadsheet\Calculation\Category;

class Expense extends Model
{
    use HasFactory, softDeletes;

    protected $fillable = [
        'concept',
        'category_id',
        'notes',
        'manual_created_at',
        'cost',
        'productive_unit_id'
    ];

    public function Productiveunit() {
        return $this->belongsTo(ProductiveUnit::class);
    }

    public function Sowings() {
        return $this->belongsToMany(Sowing::class, 'sowing_expenses');
    }

    public function Category() {
        return $this->belongsTo(ExpenseCategory::class);
    }

    public function getSowingCost($sowingId){
        return Expense::selectRaw('SUM(cost) as total_cost, expense_categories.name as name')
            ->leftJoin('sowing_expenses', 'sowing_expenses.expense_id', '=', 'expenses.id')
            ->leftJoin('expense_categories', 'expenses.category_id', '=', 'expense_categories.id')
            ->where('sowing_expenses.sowing_id', $sowingId)
            ->groupBy('expenses.category_id', 'expense_categories.name')
            ->get();

    }

    public function getAll() {
        $user = Auth::user();
        return Expense::orderBy('manual_created_at', 'desc')
            ->with('Category')
            ->where('productive_unit_id', $user->productive_unit_id)
            ->paginate(20);
    }

    public function AllBySowing($sowingId) {
        return Expense::orderBy('manual_created_at', 'desc')
            ->with('Category')
            ->whereHas('Sowings', function ($query) use ($sowingId) {
                if($sowingId) {
                    $query->where('sowing_id', $sowingId);
                    $query->with('Sowings');
                }
            })
            ->paginate(20);
    }

    public function latestBySowing($sowingId) {
        return Expense::orderBy('manual_created_at', 'desc')
            ->whereHas('Sowings', function ($query) use ($sowingId) {
                if($sowingId) {
                    $query->where('sowing_id', $sowingId);
                    $query->with('Sowings');
                }
            })
            ->get();
    }

    public function Latest() {
        $user = Auth::user();
        return Expense::orderBy('manual_created_at', 'desc')
            ->where('manual_created_at', '>=', now()->subDays(30))
            ->where('productive_unit_id', $user->productive_unit_id)
            ->get();
    }
}
