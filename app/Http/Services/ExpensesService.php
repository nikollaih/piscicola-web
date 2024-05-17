<?php

namespace App\Http\Services;
use App\Models\ExpenseCategory;
use App\Models\Expense;
use App\Models\Sowing;
use App\Models\SowingExpense;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\ExpenseCreateRequest;

class ExpensesService {

    public function getExpensesCategories(){
        $expenseCategories = ExpenseCategory::orderBy('name', 'asc')->get();
        return   ['expenseCategories' => $expenseCategories];
    }

    public function storeExpense(ExpenseCreateRequest $request, $sowingId = -1){
        $sowing = Sowing::find($sowingId);
        $user = Auth::user();
        $expenseRequest = $request->all();
        $expenseRequest["productive_unit_id"] = $user->productive_unit_id;

        $expense = Expense::create($expenseRequest);

        if ($expense && $sowing) {
            $sowingExpense["sowing_id"] = $sowingId;
            $sowingExpense["expense_id"] = $expense->id;
            SowingExpense::create($sowingExpense);
        }
    }
    public function getExpenseInfo($expenseId = -1){
        $expenseCategories = ExpenseCategory::orderBy('name', 'asc')->get();
        $expense = Expense::with('Category')->find($expenseId);
        return ['expenseCategories' => $expenseCategories,'expense' => $expense];
    }

    public function updateExpense(ExpenseCreateRequest $request, $expenseId = -1){
        $expenseRequest = $request->all();
        Expense::where('id', $expenseId)->update($expenseRequest);
    }
    public function getAllExpenses( $sowingId = -1){
        $Sowing = new Sowing();
        $Sowing->setSowingId($sowingId);
        $Expense = new Expense();

        $sowing = $Sowing->Get();
        $expenses = ($sowing) ? $Expense->AllBySowing($sowingId) : $Expense->getAll();
        $latestExpenses = ($sowing) ? $Expense->latestBySowing($sowingId) : $Expense->Latest();
        return ['sowing' => $sowing,'expenses' => $expenses,'latestExpenses' => $latestExpenses,];
    }
    public function destroyExpense( $expenseId = -1){
       // Get the biomasse the user is trying to delete
        $expense = Expense::with('Sowings')->find($expenseId);

        // If the user exists
        if($expense){
            if($expense->sowings) {
                $sowing = Sowing::find($expense->sowings[0]->id);
                if($sowing->sale_date) return ["msg" => "No es posible eliminar el registro para una cosecha vendida","status" => false];
            }

            // Do the soft delete
            if($expense->delete()){
                // Return a confirmation message
                return ["msg" => "Registro eliminado satisfactoriamente", "status" => true];
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return ["msg" => "No ha sido posible eliminar el registro","status" => false];
            }
        }
        else {
            // If the user doesn't exist
            return ["msg" => "El registro no existe" , "status" => false];
        }
    }
}
