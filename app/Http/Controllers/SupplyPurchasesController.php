<?php

namespace App\Http\Controllers;

use App\Http\Requests\SupplyCreateRequest;
use App\Http\Requests\SupplyPurchasesCreateRequest;
use App\Http\Requests\SupplyPurchasesUpdateRequest;
use App\Models\MeasurementUnit;
use App\Models\Supply;
use App\Models\SupplyPurchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;


class SupplyPurchasesController extends Controller
{
    public function create($supplyId): Response
    {
        $supply = Supply::find($supplyId);

        return \inertia('Supplies/Purchases/Create', [
            'supply' => $supply,
            'supplyUrl' => route('supply.view', ['supplyId' => $supplyId]),
            'formActionUrl' => route('supply_purchase.store')
        ]);
    }

    /**
     * Create a new biomasse.
     */
    public function store(SupplyPurchasesCreateRequest $request)
    {
        $supplyPurchaseRequest = $request->all();
        $supplyTemp = Supply::find($supplyPurchaseRequest["supply_id"]);
        $supply = $supplyTemp->toArray();
        $newSupply["available_quantity"] = doubleval($supply["available_quantity"]) + doubleval($supplyPurchaseRequest["quantity"]);

        SupplyPurchase::create($supplyPurchaseRequest);
        Supply::where('id', $supplyPurchaseRequest["supply_id"])->update($newSupply);
    }

    /**
     * Display the user's profile form.
     */
    public function edit($supplyPurchaseId): Response
    {
        $supplyPurchase = SupplyPurchase::find($supplyPurchaseId);
        $supply = Supply::find($supplyPurchase->supply_id);

        return \inertia('Supplies/Purchases/Create', [
            'supply' => $supply,
            'supplyPurchase' => $supplyPurchase,
            'supplyUrl' => route('supply.view', ['supplyId' => $supply->id]),
            'formActionUrl' => route('supply_purchase.update', ['supplyPurchaseId' => $supplyPurchaseId])
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(SupplyPurchasesUpdateRequest $request, $supplyPurchaseId)
    {
        $oldSupplyPurchase = SupplyPurchase::find($supplyPurchaseId);
        $supplyPurchaseRequest = $request->all();
        $supply = Supply::find($oldSupplyPurchase->supply_id);

        $newSupply["available_quantity"] = (doubleval($supply->available_quantity) - doubleval($oldSupplyPurchase->quantity)) + doubleval($supplyPurchaseRequest["quantity"]);

        SupplyPurchase::where('id', $supplyPurchaseId)->update($supplyPurchaseRequest);
        Supply::where('id', $oldSupplyPurchase->supply_id)->update($newSupply);
    }

    /**
     * Delete the $supply row
     */
    public function destroy($supplyPurchaseId)
    {
        $supplyPurchase = SupplyPurchase::find($supplyPurchaseId);

        if (!$supplyPurchase) {
            return response()->json(["msg" => "La compra no existe."], 404);
        }

        $supply = Supply::find($supplyPurchase->supply_id);

        if (!$supply) {
            return response()->json(["msg" => "El suministro asociado no existe."], 404);
        }

        $newSupply["available_quantity"] = max(0, doubleval($supply->available_quantity) - doubleval($supplyPurchase->quantity));

        if ($supplyPurchase->delete()) {
            $supply->update($newSupply);
            return response()->json(["msg" => "Registro eliminado satisfactoriamente"], 200);
        }

        return response()->json(["msg" => "No ha sido posible eliminar el registro"], 500);
    }

}
