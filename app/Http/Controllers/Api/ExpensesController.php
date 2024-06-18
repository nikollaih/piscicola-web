<?php

namespace App\Http\Controllers\Api;

use App\Http\Services\ExpensesService;
use App\Http\Requests\ExpenseCreateRequest;
use App\Http\Controllers\Api\BaseController as BaseController;
use Illuminate\Http\Request;

class ExpensesController extends BaseController
{
    public function __construct(private ExpensesService $expensesService  ){}
    /**
     * Display sowings listing
     */
    public function getExpensesCategories()
    {
        try {
            $categories = $this->expensesService->getExpensesCategories();

            return $this->sendResponse($categories, 'categorías obtenidas correctamente');

        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }

    }
    public function storeExpense(ExpenseCreateRequest $request, $sowingId = -1)
    {
        try {
            $this->expensesService->storeExpense($request,$sowingId);
            return $this->sendResponse(true, 'Gasto registrado correctamente');

        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }

    }
    public function getExpenseInfo($expenseId)
    {
        try {
            $expenseInfo = $this->expensesService->getExpenseInfo($expenseId);
            return $this->sendResponse($expenseInfo, 'Gasto registrado correctamente');

        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function updateExpense(ExpenseCreateRequest $request, $expenseId = -1)
    {
        try {
            $this->expensesService->updateExpense($request,$expenseId);
            return $this->sendResponse(true, 'Gasto actualizado correctamente');

        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function getAllExpenses( $sowingId = -1, $startDate = null, $endDate = null)
    {
        try {
            $endDate = ($endDate !== null) ? $endDate : date('Y-m-d');
            $startDate = ($startDate !== null) ? $startDate : date('m-Y', strtotime('-1 months', strtotime($endDate)));

            $expenseList = $this->expensesService->getAllExpenses($sowingId, $startDate, $endDate);
            return $this->sendResponse($expenseList, 'Lista de gastos obtenida correctamente');

        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function destroyExpense( $expenseId)
    {
        try {
            $deleteInfo = $this->expensesService->destroyExpense($expenseId);
            if($deleteInfo["status"]){
                return $this->sendResponse(true, $deleteInfo["msg"]);
            }
            return $this->sendError($deleteInfo["msg"]);

        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
}
