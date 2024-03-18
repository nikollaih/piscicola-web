<?php

namespace App\Http\Controllers;

use App\Http\Requests\StepStatCreateRequest;
use App\Models\Step;
use App\Models\StepStat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StepStatsController extends Controller
{
    public function index($stepId = null) {
        $StepStat = new StepStat();
        $step_stats = $StepStat->getAll($stepId);

        return Inertia::render('StepStats/Index', [
            'stepId' => $stepId,
            'step_stats' => $step_stats,
            'csrfToken' => csrf_token()
        ]);
    }

    public function create($stepId = null) {
        $steps = Step::all();

        return Inertia::render('StepStats/Create', [
            'stepId' => $stepId,
            'steps' => $steps
        ]);
    }

    public function store(StepStatCreateRequest $request) {
        $stepStatRequest = $request->all();
        StepStat::create($stepStatRequest);
    }

    public function edit($stepStatId, $stepId = null) {
        $steps = Step::all();
        $stepStat = StepStat::with('Step')->find($stepStatId);

        return Inertia::render('StepStats/Create', [
            'stepId' => $stepId,
            'step_stat' => $stepStat,
            'steps' => $steps
        ]);
    }

    public function update(StepStatCreateRequest $request, $stepStatId) {
        $stepStatRequest = $request->all();
        StepStat::where('id', $stepStatId)->update($stepStatRequest);
    }

    public function destroy($stepStatId)
    {
        // Get the association the user is trying to delete
        $register = StepStat::find($stepStatId);

        // If the user exists
        if($register){
            // Do the soft delete
            if($register->delete()){
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
