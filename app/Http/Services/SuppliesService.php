<?php

namespace App\Http\Services;

use App\Models\Supply;
use App\Models\SupplyPurchase;
use App\Models\MeasurementUnit;
use App\Http\Requests\SupplyCreateRequest;
use App\Http\Requests\SupplyUpdateRequest;
use Illuminate\Support\Facades\Auth;


class SuppliesService {

    public function getAllSupplies(){
        $Supply = new Supply();
        $supplies = $Supply->getAll();
        return ['supplies' => $supplies];
    }
    public function getMeasurements(){
        return MeasurementUnit::all();
    }

    public function storeSupply(SupplyCreateRequest $request){
        $user = Auth::user();
        $supplyRequest = $request->all();
        $supplyRequest['productive_unit_id'] = $user->productive_unit_id;
        $supplyRequest["available_quantity"] = $supplyRequest["quantity"];
        $supply = Supply::create($supplyRequest);

        $supplyPurchase["supply_id"] = $supply->id;
        $supplyPurchase["quantity"] = $supplyRequest["quantity"];
        $supplyPurchase["price"] = $supplyRequest["total_price"];
        $supplyPurchase["notes"] = $supplyRequest["notes"];
        $supplyPurchase["manual_created_at"] = $supplyRequest["manual_created_at"];
        SupplyPurchase::create($supplyPurchase);
    }

    public function destroySupply($supplyId = -1){
        // Get the biomasse the user is trying to delete
        $supply = Supply::find($supplyId);

        // If the user exists
        if($supply){
            // Do the soft delete
            if($supply->delete()){
                // Return a confirmation message
                return ["msg" => "Registro eliminado satisfactoriamente", "status" => true];
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return ["msg" => "No ha sido posible eliminar el registro", "status" =>false];
            }
        }
        else {
            // If the user doesn't exist
            return ["msg" => "El registro no existe","status" =>false];
        }

    }
    public function getSupplyInfo($supplyId = -1){
        $SupplyPurchase = new SupplyPurchase();
        $supply = Supply::with('MeasurementUnit')->find($supplyId);
        $supplyPurchases = $SupplyPurchase->getAll($supplyId);
        return ['supply' => $supply,'supplyPurchases' => $supplyPurchases];
    }

    public function updateSupply(SupplyUpdateRequest $request,$supplyId){
        $supplyRequest = $request->all();
        Supply::where('id', $supplyId)->update($supplyRequest);
    }
}
