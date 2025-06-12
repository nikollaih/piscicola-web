<?php

namespace App\Http\Controllers;

use App\Helpers\SowingNews;
use App\Http\Requests\MortalityCreateRequest;
use App\Http\Requests\MortalityUpdateRequest;
use App\Models\Biomasse;
use App\Models\Mortality;
use App\Models\Sowing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class MortalitiesController extends Controller
{
    public function __construct()
    {
        $this->SowingNews = new SowingNews();
    }

    /**
     * Display mortalities listing
     */
    public function index(Request $request, $sowingId): Response
    {
        $Sowing = new Sowing();
        $Sowing->setSowingId($sowingId);
        $Mortality = new Mortality();

        $sowing = $Sowing->Get();
        $mortalities = $Mortality->AllBySowing($sowingId);
        $latestMortalities = $Mortality->Latest($sowingId);

        return \inertia('Mortalities/Index', [
            'sowing' => $sowing,
            'mortalities' => $mortalities,
            'latestMortalities' => $latestMortalities,
            'request' => $request,
            'baseUrl' => url('/'),
            'createMortalityUrl' => route('mortality.create', ['sowingId' => $sowingId]),
            'csrfToken' => csrf_token()
        ]);
    }

    public function create ($sowingId): Response {
        $Biomasse = new Biomasse();
        $activeBiomasse = $Biomasse->Active($sowingId);

        return \inertia('Mortalities/Create', [
            'biomasseId' => $activeBiomasse->id,
            'mortalitiesUrl' => route('mortalities', ['sowingId' => $sowingId]),
            'formActionUrl' => route('mortality.store', ['sowingId' => $sowingId])
        ]);
    }

    public function store (MortalityCreateRequest $request, $sowingId) {
        $Biomasse = new Biomasse();
        $sowing = Sowing::find($sowingId);
        $activeBiomasse = $Biomasse->Active($sowingId);

        $mortailityRequest = $request->all();
        $mortailityRequest["biomasse_id"] = $activeBiomasse->id;
        $mortality = Mortality::create($mortailityRequest);

        if($mortality) {
            $deadQuantity = doubleval($sowing->dead_quantity) + doubleval($mortailityRequest["dead"]);
            Sowing::where('id', $sowingId)->update(['dead_quantity' => $deadQuantity]);
            $this->SowingNews->newMortality($mortality->id);
        }

        // Api response
        if($request->is('api/*')){
            if($mortality){
                $Mortality = Mortality::class;

                return response()->json($Mortality::find($mortality->id), 200);
            }
            return response()->json([], 500);
        }
    }

    public function edit ($mortalityId) {
        $Mortality = new Mortality();
        $mortality = $Mortality->Get($mortalityId);

        return \inertia('Mortalities/Create', [
            'biomasseId' => $mortality->biomasse_id,
            'mortality' => $mortality,
            'mortalitiesUrl' => route('mortalities', ['sowingId' => $mortality->biomasse->sowing->id]),
            'formActionUrl' => route('mortality.update', ['mortalityId' => $mortality->biomasse_id])
        ]);
    }

    public function update (MortalityUpdateRequest $request, $mortalityId) {
        $mortalityRequest = $request->all();
        Mortality::where('id', $mortalityId)->update($mortalityRequest);
    }

    /**
     * Delete the mortality row
     */
    public function destroy($mortalityId): JsonResponse
    {
        // Get the mortality the user is trying to delete
        $mortality = Mortality::with('Biomasse')->find($mortalityId);
        $sowing = $mortality->biomasse->sowing;

        // If the user exists
        if($mortality){
            if($sowing->sale_date) return response()->json(["msg" => "No es posible eliminar el registro para una cosecha vendida"], 500);
            // Do the soft delete
            if($mortality->delete()){
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

    public function readings(Request $request, $sowingId, $biomasseIdOne = null, $biomasseIdTwo = null): Response
    {
        $readings = [];
        $Biomasse = new Biomasse();
        $Sowing = new Sowing();
        $Mortality = new Mortality();

        $Sowing->setSowingId($sowingId);
        $sowing = $Sowing->Get();

        $biomasseOne = $Biomasse->Get($biomasseIdOne);
        $biomasseTwo = $Biomasse->Get($biomasseIdTwo);
        $biomasses = $Biomasse->AllBySowing($sowingId);

        $readings['step_stat']["name"] = "Mortalidad";
        $readings['data_one'] = $Mortality->GetByBiomasse($biomasseIdOne);
        $readings['data_two'] = $Mortality->GetByBiomasse($biomasseIdTwo);

        return \inertia('Mortalities/Readings', [
            'sowing' => $sowing,
            'biomasseOne' => $biomasseOne,
            'biomasseTwo' => $biomasseTwo,
            'biomasses' => $biomasses,
            'readings' => $readings,
            'request' => $request,
            'baseUrl' => url('/'),
            'csrfToken' => csrf_token()
        ]);
    }
}
