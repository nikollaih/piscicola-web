<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActuatorCreateRequest;
use App\Http\Requests\PondCreateRequest;
use App\Models\Actuator;
use App\Models\ActuatorType;
use App\Models\ActuatorUse;
use App\Models\Pond;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class ActuatorsController extends Controller
{
    /**
     * Display mortalities listing
     */
    public function index(Request $request): Response
    {
        $Actuator = new Actuator();
        $actuators = $Actuator->getAll();

        return \inertia('Actuators/Index', [
            'actuators' => $actuators,
            'csrfToken' => csrf_token()
        ]);
    }

    public function view($actuatorId): Response {
        $Actuator = new Actuator();
        $ActuatorUse = new ActuatorUse();
        $actuator = $Actuator->Get($actuatorId);
        $actuatorUses = $ActuatorUse->getAll($actuatorId);
        $readings = $ActuatorUse->getAll($actuatorId, false);

        return \inertia('Actuators/View', [
            'actuator' => $actuator,
            'actuatorUses' => $actuatorUses,
            'readings' => $readings,
            'csrfToken' => csrf_token()
        ]);
    }

    public function create (): Response {
        $Pond = new Pond();
        $ponds = $Pond->getAll();
        $actuatorTypes = ActuatorType::all();

        return \inertia('Actuators/Create', [
            'ponds' => $ponds,
            'actuatorTypes' => $actuatorTypes,
            'goBackRoute' => route('actuators'),
            'formActionUrl' => route('actuator.store')
        ]);
    }

    public function store (ActuatorCreateRequest $request) {
        $actuatorRequest = $request->all();
        $actuator = Actuator::create($actuatorRequest);

        // Api response
        if($request->is('api/*')){
            if($actuator){
                return response()->json(Pond::find($actuator->id), 200);
            }
            return response()->json([], 500);
        }
    }

    /**
     * Display the user's profile form.
     */
    public function edit($actuatorId): Response
    {
        $Pond = new Pond();
        $Actuator = new Actuator();
        $ponds = $Pond->getAll();
        $actuatorTypes = ActuatorType::all();
        $actuator = $Actuator->Get($actuatorId);

        return \inertia('Actuators/Create', [
            'actuator' => $actuator,
            'ponds' => $ponds,
            'actuatorTypes' => $actuatorTypes,
            'goBackRoute' => route('actuator.view', ['actuatorId' => $actuatorId]),
            'formActionUrl' => route('actuator.update', ['actuatorId' => $actuatorId])
        ]);
    }

    /**
     * Update the actuator's profile information.
     */
    public function update(ActuatorCreateRequest $request, $actuatorId)
    {
        $actuatorRequest = $request->all();
        Actuator::where('id', $actuatorId)->update($actuatorRequest);
    }

    /**
     * Delete the actuator row
     */
    public function destroy($actuatorId)
    {
        // Get the actuator the user is trying to delete
        $actuator = Actuator::find($actuatorId);

        // If the user exists
        if($actuator){
            // Do the soft delete
            if($actuator->delete()){
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
