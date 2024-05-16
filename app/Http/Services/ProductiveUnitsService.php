<?php

namespace App\Http\Services;

use App\Http\Requests\StepStatCreateRequest;
use App\Http\Requests\ProductiveUnitCreateRequest;
use App\Models\Association;
use App\Models\ProductiveUnit;

class ProductiveUnitsService {


    public function index($stepId = null){
        $Association = new Association();
        $associations = $Association->getAll();
        return [
            'associations' => $associations,
        ];
   }
    public function getAllAssociations(){
        $associations = Association::all();
        return [
            'associations' => $associations,
        ];
   }

    public function store(ProductiveUnitCreateRequest $request){
        $productiveUnitRequest = $request->all();
        $productiveUnit = ProductiveUnit::create($productiveUnitRequest);
        return  ProductiveUnit::findOrFail($productiveUnit->id);
    }

    public function view($productiveUnitId) {
        $associations = Association::all();
        $productiveUnit = ProductiveUnit::with('Association')->find($productiveUnitId);
        return [
            'associations' => $associations,
            'productive_unit' => $productiveUnit
        ];
   }
    public function update(ProductiveUnitCreateRequest $request, $productiveUnitId)
    {
        $productiveUnitRequest = $request->all();
        ProductiveUnit::where('id', $productiveUnitId)->update($productiveUnitRequest);
    }

    public function destroy($productiveUnitId = -1)
    {
        // Get the association the user is trying to delete
        $productiveUnit = ProductiveUnit::find($productiveUnitId);

        // If the user exists
        if($productiveUnit){
            // Do the soft delete
            if($productiveUnit->delete()){
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
}