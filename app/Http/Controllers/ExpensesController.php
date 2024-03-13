<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExpenseCreateRequest;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\Sowing;
use App\Models\SowingExpense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class ExpensesController extends Controller
{
    public function index ($sowingId = null) :Response {
        $Sowing = new Sowing();
        $Sowing->setSowingId($sowingId);
        $Expense = new Expense();

        $sowing = $Sowing->Get();
        $expenses = ($sowing) ? $Expense->AllBySowing($sowingId) : $Expense->getAll();
        $latestExpenses = ($sowing) ? $Expense->latestBySowing($sowingId) : $Expense->Latest();

        return \inertia('Expenses/Index', [
            'sowing' => $sowing,
            'expenses' => $expenses,
            'latestExpenses' => $latestExpenses,
            'createExpenseUrl' => route('expense.create', ['sowingId' => $sowingId]),
            'csrfToken' => csrf_token()
        ]);
    }

    public function create($sowingId = null): Response {
        $expenseCategories = ExpenseCategory::orderBy('name', 'asc')->get();
        return \inertia('Expenses/Create', [
            'expenseCategories' => $expenseCategories,
            'expensesUrl' => route('expenses', ['sowingId' => $sowingId]),
            'formActionUrl' => route('expense.store', ['sowingId' => $sowingId]),
            'csrfToken' => csrf_token()
        ]);
    }

    public function store(ExpenseCreateRequest $request, $sowingId = null) {
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

    /**
     * Display the expense's form.
     */
    public function edit($expenseId, $sowingId = null): Response
    {
        $expenseCategories = ExpenseCategory::orderBy('name', 'asc')->get();
        $expense = Expense::with('Category')->find($expenseId);

        return \inertia('Expenses/Create', [
            'expenseCategories' => $expenseCategories,
            'expense' => $expense,
            'expensesUrl' => route('expenses', ['sowingId' => $sowingId]),
            'formActionUrl' => route('expense.update', ['expenseId' => $expenseId]),
            'csrfToken' => csrf_token()
        ]);
    }

    /**
     * Update the expense's information.
     */
    public function update(ExpenseCreateRequest $request, $expenseId)
    {
        $expenseRequest = $request->all();
        Expense::where('id', $expenseId)->update($expenseRequest);
    }

    /**
     * Delete the biomasse row
     */
    public function destroy($expenseId)
    {
        // Get the biomasse the user is trying to delete
        $expense = Expense::find($expenseId);

        // If the user exists
        if($expense){
            // Do the soft delete
            if($expense->delete()){
                // Return a confirmation message
                return response()->json(["msg" => "Registro eliminado satisfactoriamente"], 200);
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return response()->json(["msg" => "No ha sido posible eliminar el registro"], 500);
            }
        }
        else {
            // If the user doesn't exist
            return response()->json(["msg" => "El registro no existe"], 404);
        }
    }
}
