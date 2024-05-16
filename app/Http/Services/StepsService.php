<?php

namespace App\Http\Services;

use App\Http\Requests\StepCreateRequest;
use App\Models\Step;

class StepsService {


    public function index(){
        $steps = Step::all();
        return [
            'steps' => $steps,
        ];
    }
    
    public function store(StepCreateRequest $request){
        $stepRequest = $request->all();
        Step::create($stepRequest);
    }

    public function update(StepCreateRequest $request, $stepId){
        $stepRequest = $request->all();
        Step::where('id', $stepId)->update($stepRequest);
    }

    public function destroy($stepId = -1){
    {
        // Get the association the user is trying to delete
        $register = Step::find($stepId);

        // If the user exists
        if($register){
            // Do the soft delete
            if($register->delete()){
                // Return a confirmation message
                return ["msg" => "Registro eliminado satisfactoriamente", "status" => true];
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return ["msg" => "No ha sido posible eliminar el registro" , "status" => false];
            }
        }
        else {
            // If the user doesn't exist
            return ["msg" => "El registro no existe", "status" => false];
        }
    }
    }
}