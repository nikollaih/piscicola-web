<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssociationCreateRequest;
use App\Http\Requests\ProductiveUnitCreateRequest;
use App\Models\Association;
use App\Models\ProductiveUnit;
use Illuminate\Http\Request;

class ProductiveUnitsController extends Controller
{
    public function index() {
        $Association = new Association();
        $associations = $Association->getAll();

        return \inertia('ProductiveUnits/Index', [
            'associations' => $associations,
            'csrfToken' => csrf_token()
        ]);
    }

    public function create() {
        $associations = Association::all();

        return \inertia('ProductiveUnits/Create', [
            'associations' => $associations,
            'formActionUrl' => route('productive_unit.store'),
            'csrfToken' => csrf_token()
        ]);
    }

    public function edit($productiveUnitId) {
        $associations = Association::all();
        $productiveUnit = ProductiveUnit::with('Association')->find($productiveUnitId);

        return \inertia('ProductiveUnits/Create', [
            'associations' => $associations,
            'productive_unit' => $productiveUnit,
            'formActionUrl' => route('productive_unit.update', ['productiveUnitId' => $productiveUnitId]),
            'csrfToken' => csrf_token()
        ]);
    }

    public function update(ProductiveUnitCreateRequest $request, $productiveUnitId)
    {
        $productiveUnitRequest = $request->all();
        ProductiveUnit::where('id', $productiveUnitId)->update($productiveUnitRequest);
    }

    public function store (ProductiveUnitCreateRequest $request) {
        $productiveUnitRequest = $request->all();
        $productiveUnit = ProductiveUnit::create($productiveUnitRequest);

        // Api response
        if($request->is('api/*')){
            if($productiveUnit){
                return response()->json(ProductiveUnit::find($productiveUnit->id), 200);
            }
            return response()->json([], 500);
        }
    }

    public function destroy($productiveUnitId)
    {
        // Get the association the user is trying to delete
        $productiveUnit = ProductiveUnit::find($productiveUnitId);

        // If the user exists
        if($productiveUnit){
            // Do the soft delete
            if($productiveUnit->delete()){
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
