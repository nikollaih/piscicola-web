<?php

namespace App\Http\Controllers;

use App\Http\Requests\StepCreateRequest;
use App\Models\Step;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StepsController extends Controller
{
    public function index() {
        $steps = Step::all();

        return Inertia::render('Steps/Index', [
            'steps' => $steps,
            'csrfToken' => csrf_token()
        ]);
    }

    public function store(StepCreateRequest $request) {
        $stepRequest = $request->all();
        Step::create($stepRequest);
    }

    public function update(StepCreateRequest $request, $stepId) {
        $stepRequest = $request->all();
        Step::where('id', $stepId)->update($stepRequest);
    }

    public function destroy($stepId)
    {
        // Get the association the user is trying to delete
        $register = Step::find($stepId);

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
