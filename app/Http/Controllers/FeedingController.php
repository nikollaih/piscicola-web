<?php

namespace App\Http\Controllers;

use App\Helpers\SowingNews;
use App\Http\Requests\SupplyUseCreateRequest;
use App\Http\Requests\SupplyUseUpdateRequest;
use App\Models\Biomasse;
use App\Models\SowingNew;
use App\Models\SupplyUse;
use App\Models\Sowing;
use App\Models\Supply;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeedingController extends Controller
{

    public function __construct()
    {
        $this->SowingNews = new SowingNews();
    }

    /**
    * Display feeding listing
    */
    public function index(Request $request, $sowingId): Response
    {
        $Sowing = new Sowing();
        $Feeding = new SupplyUse();
        $Supply = new Supply();

        $supplies = $Supply->getAllByUse("ALIMENT");
        $Sowing->setSowingId($sowingId);

        $sowing = $Sowing->Get();
        $feeding = $Feeding->getAll($sowingId, 'ALIMENT', true);
        $allFeeding["data"] = $Feeding->getAll($sowingId, 'ALIMENT');

        return \inertia('SupplyUse/Index', [
            'title' => 'alimentación',
            'supplies' => $supplies,
            'sowing' => $sowing,
            'feeds' => $feeding,
            'readings' => $allFeeding,
            'request' => $request,
            'baseUrl' => url('/'),
            'addRoute' => route('feeding.create', ['sowingId' => $sowingId]),
            'deleteRoute' => 'feeding.delete',
            'compareRoute' => route('feeding.readings.compare', ['sowingId' => $sowingId]),
            'csrfToken' => csrf_token()
        ]);
    }

    public function readings(Request $request, $sowingId, $biomasseIdOne = null, $biomasseIdTwo = null): Response
    {
        $readings = [];
        $Biomasse = new Biomasse();
        $Sowing = new Sowing();
        $SupplyUse = new SupplyUse();
        $Supply = new Supply();

        $Sowing->setSowingId($sowingId);
        $sowing = $Sowing->Get();

        $biomasseOne = $Biomasse->Get($biomasseIdOne);
        $biomasseTwo = $Biomasse->Get($biomasseIdTwo);
        $biomasses = $Biomasse->AllBySowing($sowingId);

        $supplies = $Supply->getAllByUse('ALIMENT');

        if($biomasseOne && $biomasseTwo) {
            for ($i = 0; $i < count($supplies); $i++) {
                $supply = $supplies[$i];
                $readings[$i]['step_stat'] = $supply;
                $readings[$i]['data_one'] = $SupplyUse->getBySupplyBiomasse($sowingId, $supply->id, $biomasseOne->id);
                $readings[$i]['data_two'] = $SupplyUse->getBySupplyBiomasse($sowingId, $supply->id, $biomasseTwo->id);
            }
        }

        return \inertia('SupplyUse/Readings', [
            'title' => 'alimentación',
            'sowing' => $sowing,
            'biomasseOne' => $biomasseOne,
            'biomasseTwo' => $biomasseTwo,
            'biomasses' => $biomasses,
            'readings' => $readings,
            'request' => $request,
            'baseUrl' => url('/'),
            'indexRoute' => route('feeding', ['sowingId' => $sowingId]),
            'compareRoute' => 'feeding.readings.compare',
            'csrfToken' => csrf_token()
        ]);
    }

    public function create($sowingId): Response
    {
        $Biomasse = new Biomasse();
        $Supply = new Supply();

        $latestBiomasse = $Biomasse->Active($sowingId);
        $supplies = $Supply->getAllByUse("ALIMENT");

        return \inertia('SupplyUse/Create', [
            'sowingId' => $sowingId,
            'biomasseId' => $latestBiomasse->id,
            'supplies' => $supplies,
            'indexRoute' => route('feeding', ['sowingId' => $sowingId]),
            'formActionUrl' => route('feeding.store')
        ]);
    }

    /**
     * Create a new biomasse.
     */
    public function store(SupplyUseCreateRequest $request)
    {
        $Supply = new Supply();
        $feedingRequest = $request->all();
        $feedingRequest["unit_cost"] = $Supply->getCost($feedingRequest["supply_id"]);
        $feeding = SupplyUse::create($feedingRequest);

        if ($feeding) {
            $Supply->Use($feedingRequest["supply_id"], $feedingRequest["quantity"]);
            $this->SowingNews->newFeeding($feeding->id);
        }
    }

    /**
     * Display the user's profile form.
     */
    public function edit($feedingId): Response
    {
        $Supply = new Supply();
        $feeding = SupplyUse::with('Supply.MeasurementUnit')->find($feedingId);
        $supplies = $Supply->getAllByUse("ALIMENT");

        return \inertia('SupplyUse/Create', [
            'sowingId' => $feeding->sowing_id,
            'biomasseId' => $feeding->biomasse_id,
            'feed' => $feeding,
            'supplies' => $supplies,
            'formActionUrl' => route('feeding.update', ['feedingId' => $feedingId])
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(SupplyUseUpdateRequest $request, $feedingId)
    {
        $Supply = new Supply();
        $oldFeeding = SupplyUse::find($feedingId);
        $feedingRequest = $request->all();

        if (SupplyUse::where('id', $feedingId)->update($feedingRequest)) {
            $Supply->modifyUse($oldFeeding->supply_id, $oldFeeding->quantity, $feedingRequest["quantity"]);
        }
    }

    /**
     * Delete the biomasse row
     */
    public function destroy($feedingId)
    {
        $Supply = new Supply();

        // Get the biomasse the user is trying to delete
        $supplyUse = SupplyUse::find($feedingId);

        // If the user exists
        if($supplyUse){
            // Do the soft delete
            if($supplyUse->delete()){
                $Supply->modifyUse($supplyUse->supply_id, $supplyUse->quantity, 0);
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
