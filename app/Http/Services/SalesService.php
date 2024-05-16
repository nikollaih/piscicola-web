<?php

namespace App\Http\Services;

use App\Http\Requests\SalesCreateRequest;
use App\Models\Sale;
use App\Models\Sowing;
use App\Models\Party;

class SalesService {

     public function index() {
        $Sale = new Sale();
        $sales = $Sale->getAll();

        return ["sales" => $sales];
    }

    public function getInfoToCreate($sowingId = -1) {
        $Sowing = new Sowing();
        $Sowing->setSowingId($sowingId);
        $Party = new Party();
        $sowing = $Sowing->Get();
        $clients = $Party->getAllByRole(1);

        return [
            'clients' => $clients,
            'sowing' => $sowing
        ];
    }
    public function store(SalesCreateRequest $request, $sowingId = -1){
        $saleRequest = $request->all();
        $saleRequest["sowing_id"] = $sowingId;
        $saved = Sale::create($saleRequest);

        if($saved){
            Sowing::where('id', $sowingId)->update(['sale_date' => $saleRequest["manual_created_at"]]);
        }
        return Sale::find($saved->id);
   }
    public function view($saleId = -1) {
        $Sale = new Sale();
        $Sowing = new Sowing();
        $Party = new Party();

        $sale = $Sale->get($saleId);
        $Sowing->setSowingId($sale->sowing_id);
        $sowing = $Sowing->Get();
        $clients = $Party->getAllByRole(1);
        return [
            'clients' => $clients,
            'sowing' => $sowing,
            'sale' => $sale,
        ];
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
    public function destroy($saleId = -1) 
    {
        // Get the mortality the user is trying to delete
        $sale = Sale::find($saleId);

        // If the user exists
        if($sale){
            $Sowing = new Sowing();
            $Sowing->setSowingId($sale->sowing_id);
            // Do the soft delete
            if($sale->delete()){
                Sowing::where('id', $sale->sowing_id)->update(['sale_date' => null]);

                // Return a confirmation message
                return ["msg" => "Registro eliminado satisfactoriamente","sucess" => true];
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return ["msg" => "No ha sido posible eliminar el registro", "sucess" => false];
            }
        }
        else {
            // If the user doesn't exist
            return ["msg" => "El registro no existe", "sucess" =>false];
        }
    }
}