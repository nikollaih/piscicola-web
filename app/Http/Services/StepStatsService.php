<?php

namespace App\Http\Services;

use App\Http\Requests\StepStatCreateRequest;
use App\Models\StepStat;

class StepStatsService {


    public function index($stepId = null){
        $StepStat = new StepStat();
        $step_stats = $StepStat->getAll($stepId);
        return [
            'stepId' => $stepId,
            'step_stats' => $step_stats,
        ];
   }


    public function create($stepId = null){
        $steps = Step::all();
        return [
            'stepId' => $stepId,
            'steps' => $steps
        ];
   }

    public function store(StepStatCreateRequest $request){
        $stepStatRequest = $request->all();
        StepStat::create($stepStatRequest);
    }

    public function update(StepStatCreateRequest $request,$stepStatId){
        $stepStatRequest = $request->all();
        StepStat::where('id', $stepStatId)->update($stepStatRequest);
    }

    public function destroy($stepStatId = -1){
        // Get the association the user is trying to delete
        $register = StepStat::find($stepStatId);

        // If the user exists
        if($register){
            // Do the soft delete
            if($register->delete()){
                // Return a confirmation message
                return ["msg" => "Registro eliminado satisfactoriamente", "status" => true];
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return ["msg" => "No ha sido posible eliminar el registro", "status" => false];
            }
        }
        else {
            // If the user doesn't exist
            return ["msg" => "El registro no existe","status" => false];
        }
    }
}