<?php

namespace App\Http\Controllers;

use App\Http\Requests\SalesCreateRequest;
use App\Models\Party;
use App\Models\Sale;
use App\Models\Sowing;
use Illuminate\Http\Request;

class SalesController extends Controller
{
    public function index() {
        $Sale = new Sale();
        $sales = $Sale->getAll();

        return \inertia('Sales/Index', [
            'sales' => $sales,
            'csrfToken' => csrf_token()
        ]);
    }

    public function create($sowingId) {
        $Sowing = new Sowing();
        $Sowing->setSowingId($sowingId);
        $Party = new Party();
        $sowing = $Sowing->Get();
        $clients = $Party->getAllByRole(1);

        return \inertia('Sales/Create', [
            'clients' => $clients,
            'sowing' => $sowing,
            'formActionUrl' => route('sale.store', ['sowingId' => $sowingId]),
            'csrfToken' => csrf_token()
        ]);
    }

    public function store(SalesCreateRequest $request, $sowingId){
        $saleRequest = $request->all();
        $saleRequest["sowing_id"] = $sowingId;
        $saved = Sale::create($saleRequest);

        if($saved){
            Sowing::where('id', $sowingId)->update(['sale_date' => $saleRequest["manual_created_at"]]);
        }

        // Api response
        if($request->is('api/*')){
            if($saved){
                return response()->json(Sale::find($saved->id), 200);
            }
            return response()->json([], 500);
        }
    }

    public function edit($saleId) {
        $Sale = new Sale();
        $Sowing = new Sowing();
        $Party = new Party();

        $sale = $Sale->get($saleId);
        $Sowing->setSowingId($sale->sowing_id);
        $sowing = $Sowing->Get();
        $clients = $Party->getAllByRole(1);

        return \inertia('Sales/Create', [
            'clients' => $clients,
            'sowing' => $sowing,
            'sale' => $sale,
            'formActionUrl' => route('sale.update', ['saleId' => $saleId]),
            'csrfToken' => csrf_token()
        ]);
    }

    public function update(SalesCreateRequest $request, $saleId) {
        $sale = Sale::find($saleId);
        $Sowing = new Sowing();
        $Sowing->setSowingId($sale->sowing_id);

        $saleRequest = $request->all();
        if (Sale::where('id', $saleId)->update($saleRequest)){
            Sowing::where('id', $sale->sowing_id)->update(['sale_date' => $saleRequest["manual_created_at"]]);
        }
    }

    public function destroy($saleId): \Illuminate\Http\JsonResponse
    {
        // Get the mortality the user is trying to delete
        $sale = Sale::find($saleId);
        $Sowing = new Sowing();
        $Sowing->setSowingId($sale->sowing_id);

        // If the user exists
        if($sale){
            // Do the soft delete
            if($sale->delete()){
                Sowing::where('id', $sale->sowing_id)->update(['sale_date' => null]);

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
