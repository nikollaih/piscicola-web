<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateBiomasseRequest;
use App\Http\Requests\SupplyCreateRequest;
use App\Http\Requests\SupplyUpdateRequest;
use App\Models\Biomasse;
use App\Models\MeasurementUnit;
use App\Models\Supply;
use App\Models\SupplyPurchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class SuppliesController extends Controller
{
    /**
     * Display supplies listing
     */
    public function index(Request $request)
    {
        $Supply = new Supply();
        $supplies = $Supply->getAll();

        return \inertia('Supplies/Index', [
            'supplies' => $supplies,
            'request' => $request,
            'baseUrl' => url('/'),
            'createSupplyUrl' => route('supply.create'),
            'csrfToken' => csrf_token()
        ]);
    }

    public function view($supplyId) {
        $SupplyPurchase = new SupplyPurchase();
        $supply = Supply::with('MeasurementUnit')->find($supplyId);
        $supplyPurchases = $SupplyPurchase->getAll($supplyId);

        return \inertia('Supplies/View', [
            'supply' => $supply,
            'supplyPurchases' => $supplyPurchases,
            'baseUrl' => url('/'),
            'csrfToken' => csrf_token()
        ]);
    }

    public function create(): Response
    {
        $measurements = MeasurementUnit::all();

        return \inertia('Supplies/Create', [
            'measurements' => $measurements,
            'suppliesUrl' => route('supplies'),
            'formActionUrl' => route('supply.store')
        ]);
    }

    /**
     * Create a new biomasse.
     */
    public function store(SupplyCreateRequest $request)
    {
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

    /**
     * Display the supply's profile form.
     */
    public function edit($supplyId): Response
    {
        $measurements = MeasurementUnit::all();
        $supply = Supply::with('MeasurementUnit')->find($supplyId);

        return \inertia('Supplies/Create', [
            'supply' => $supply,
            'measurements' => $measurements,
            'suppliesUrl' => route('supplies'),
            'formActionUrl' => route('supply.update', ['supplyId' => $supplyId])
        ]);
    }

    /**
     * Update the supply's profile information.
     */
    public function update(SupplyUpdateRequest $request, $supplyId)
    {
        $supplyRequest = $request->all();
        Supply::where('id', $supplyId)->update($supplyRequest);
    }

    /**
     * Delete the $supply row
     */
    public function destroy($supplyId)
    {
        // Get the biomasse the user is trying to delete
        $supply = Supply::find($supplyId);

        // If the user exists
        if($supply){
            // Do the soft delete
            if ($supply->delete()) {
                return redirect()->route('supplies')->with('success', 'Registro eliminado satisfactoriamente');
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
