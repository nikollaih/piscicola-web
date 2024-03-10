<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActuatorCreateRequest;
use App\Http\Requests\PondCreateRequest;
use App\Models\Actuator;
use App\Models\ActuatorType;
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

    public function create (): Response {
        $ponds = Pond::all();
        $actuatorTypes = ActuatorType::all();

        return \inertia('Actuators/Create', [
            'ponds' => $ponds,
            'actuatorTypes' => $actuatorTypes,
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
}
