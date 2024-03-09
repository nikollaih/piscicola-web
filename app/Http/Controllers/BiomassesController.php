<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateBiomasseRequest;
use App\Http\Requests\SowingCreateRequest;
use App\Models\Biomasse;
use App\Models\Fish;
use App\Models\Pond;
use App\Models\Sowing;
use App\Models\StatsReading;
use App\Models\Step;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class BiomassesController extends Controller
{
    /**
     * Display biomasses listing
     */
    public function index(Request $request, $sowingId): Response
    {
        $Sowing = new Sowing();
        $Sowing->setSowingId($sowingId);
        $Biomasse = new Biomasse();

        $sowing = $Sowing->Get();
        $biomasses = $Biomasse->AllBySowing($sowingId);
        $latestBiomasses = $Biomasse->Latest($sowingId, 50);

        return \inertia('Biomasses/Index', [
            'sowing' => $sowing,
            'biomasses' => $biomasses,
            'latestBiomasses' => $latestBiomasses,
            'request' => $request,
            'baseUrl' => url('/'),
            'createBiomasseUrl' => route('biomasse.create', ['sowingId' => $sowingId]),
            'csrfToken' => csrf_token()
        ]);
    }

    /**
     * Display biomasses listing
     */
    public function readings(Request $request, $sowingId, $biomasseIdOne = null, $biomasseIdTwo = null): Response
    {
        $readings = [];
        $Biomasse = new Biomasse();
        $Sowing = new Sowing();
        $StatsReading = new StatsReading();

        $Sowing->setSowingId($sowingId);
        $sowing = $Sowing->Get();

        $biomasseOne = $Biomasse->Get($biomasseIdOne);
        $biomasseTwo = $Biomasse->Get($biomasseIdTwo);
        $biomasses = $Biomasse->AllBySowing($sowingId);

        $latestReadings = $StatsReading->latest($sowingId);

        for ($i = 0; $i < count($latestReadings); $i++) {
            $latestReading = $latestReadings[$i];
            $readings[$i]['step_stat'] = $latestReading->StepStat;
            $readings[$i]['data_one'] = $StatsReading->GetByBiomasseType($biomasseIdOne, $latestReading->StepStat->id);
            $readings[$i]['data_two'] = $StatsReading->GetByBiomasseType($biomasseIdTwo, $latestReading->StepStat->id);
        }

        return \inertia('Biomasses/Readings', [
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

    public function create($sowingId): Response
    {
        return \inertia('Biomasses/Create', [
            'sowingId' => $sowingId,
            'biomassesUrl' => url('/biomasses/sowing/'.$sowingId),
            'formActionUrl' => route('biomasse.store')
        ]);
    }

    /**
     * Create a new biomasse.
     */
    public function store(CreateBiomasseRequest $request)
    {
        $biomasseRequest = $request->all();
        Biomasse::create($biomasseRequest);
    }

    /**
     * Display the user's profile form.
     */
    public function edit($biomasseId): Response
    {
        $Biomasse = new Biomasse();
        $biomasse = $Biomasse->Get($biomasseId);
        $sowingId = $biomasse->sowing_id;

        return \inertia('Biomasses/Create', [
            'sowingId' => $sowingId,
            'biomasse' => $biomasse,
            'biomassesUrl' => url('/biomasses/sowing/'.$sowingId),
            'formActionUrl' => route('biomasse.update', ['biomasseId' => $biomasseId])
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(CreateBiomasseRequest $request, $biomasseId)
    {
        $userRequest = $request->all();
        Biomasse::where('id', $biomasseId)->update($userRequest);
    }

    /**
     * Delete the biomasse row
     */
    public function destroy($biomasseId)
    {
        // Get the biomasse the user is trying to delete
        $biomasse = Biomasse::find($biomasseId);

        // If the user exists
        if($biomasse){
            // Do the soft delete
            if($biomasse->delete()){
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
