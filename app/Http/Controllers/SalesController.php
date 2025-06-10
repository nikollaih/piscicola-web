<?php

namespace App\Http\Controllers;

use App\Http\Requests\SalesCreateRequest;
use App\Models\Party;
use App\Models\Sale;
use App\Models\Sowing;
use Illuminate\Http\Request;

class SalesController extends Controller
{
    public function index(Request $request) {
        $Sale = new Sale();
        $sales = $Sale->getAll();
        $sowingId = $request->get('sowing_id'); // por ejemplo ?sowing_id=1

        return inertia('Sales/Index', [
            'sales' => $sales,
            'sowingId' => $sowingId,
            'createSalesUrl' => route('sale.create', ['sowingId' => $sowingId]), // 👈 aquí la envío
            'csrfToken' => csrf_token()
        ]);
    }


    public function create() {
        $Party = new Party();
        $Sowing = new Sowing();

        $sowings = Sowing::orderBy('created_at', 'desc')->get(); // todas las cosechas
        $clients = $Party->getAllByRole(1);

        return inertia('Sales/Create', [
            'clients' => $clients,
            'sowings' => $sowings, // enviamos todas
            'formActionUrl' => route('sale.store'),
            'csrfToken' => csrf_token()
        ]);
    }


    public function store(SalesCreateRequest $request){
        $saleRequest = $request->all();
        $sowingId = $saleRequest["sowing_id"];

        $saved = Sale::create($saleRequest);

        if($saved){
            Sowing::where('id', $sowingId)->update(['sale_date' => $saleRequest["manual_created_at"]]);
        }

        if($request->is('api/*')){
            return response()->json($saved ? Sale::find($saved->id) : [], $saved ? 200 : 500);
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
