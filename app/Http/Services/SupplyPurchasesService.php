<?php

namespace App\Http\Services;

use App\Models\Supply;
use App\Models\SupplyPurchase;
use App\Http\Requests\SupplyPurchasesCreateRequest;
use App\Http\Requests\SupplyPurchasesUpdateRequest;

class SupplyPurchasesService {

    public function store(SupplyPurchasesCreateRequest $request){
        $supplyPurchaseRequest = $request->all();
        $supplyTemp = Supply::find($supplyPurchaseRequest["supply_id"]);
        $supply = $supplyTemp->toArray();
        $newSupply["available_quantity"] = doubleval($supply["available_quantity"]) + doubleval($supplyPurchaseRequest["quantity"]);

        SupplyPurchase::create($supplyPurchaseRequest);
        Supply::where('id', $supplyPurchaseRequest["supply_id"])->update($newSupply);
    }
    public function view($supplyPurchaseId){
        return  SupplyPurchase::find($supplyPurchaseId);
    }

    public function update(SupplyPurchasesUpdateRequest $request, $supplyPurchaseId){
        $oldSupplyPurchase = SupplyPurchase::find($supplyPurchaseId);
        $supplyPurchaseRequest = $request->all();
        $supply = Supply::find($oldSupplyPurchase->supply_id);

        $newSupply["available_quantity"] = (doubleval($supply->available_quantity) - doubleval($oldSupplyPurchase->quantity)) + doubleval($supplyPurchaseRequest["quantity"]);

        SupplyPurchase::where('id', $supplyPurchaseId)->update($supplyPurchaseRequest);
        Supply::where('id', $oldSupplyPurchase->supply_id)->update($newSupply);

    }
    public function destroy($supplyPurchaseId){
        $supplyPurchase = SupplyPurchase::find($supplyPurchaseId);


        // If the user exists
        if($supplyPurchase){
            $supply = Supply::find($supplyPurchase->supply_id);
            $newSupply["available_quantity"] = (doubleval($supply->available_quantity) - doubleval($supplyPurchase->quantity));
            // Do the soft delete
            if($supplyPurchase->delete()){
                Supply::where('id', $supplyPurchase->supply_id)->update($newSupply);
                // Return a confirmation message
                return ["msg" => "Registro eliminado satisfactoriamente","status" => true];
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return ["msg" => "No ha sido posible eliminar el registro","status" => false];
            }
        }
        else {
            // If the user doesn't exist
            return ["msg" => "El registro no existe","status" => false];
        }
    }
}
