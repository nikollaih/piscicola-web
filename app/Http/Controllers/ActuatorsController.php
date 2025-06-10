<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActuatorAutomationTimeCreateRequest;
use App\Http\Requests\ActuatorAutomationTimeDeleteRequest;
use App\Http\Requests\PondCreateRequest;
use App\Models\Actuator;
use App\Models\ActuatorAutomationTime;
use App\Models\ActuatorAutomationVariable;
use App\Models\ActuatorType;
use App\Models\ActuatorUse;
use App\Models\Pond;
use App\Models\Step;
use App\Models\StepStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Response;
use PhpMqtt\Client\Facades\MQTT;

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

    public function store (ActuatorAutomationTimeCreateRequest $request) {
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

    public function config($actuatorId): Response
    {
        $ActuatorAutomationTime = new ActuatorAutomationTime();
        $ActuatorAutomationVariable = new ActuatorAutomationVariable();
        $Actuator = new Actuator();
        $StepStat = new StepStat();
        $actuatorAutomation = $ActuatorAutomationTime->Get($actuatorId);
        $actuatorAutomationVariable = $ActuatorAutomationVariable->Get($actuatorId);
        $actuator = $Actuator->Get($actuatorId);
        $steps = $StepStat->getAllDistinct();

        return \inertia('Actuators/Config', [
            'actuator' => $actuator,
            'automation' => $actuatorAutomation,
            'automationVariable' => $actuatorAutomationVariable,
            'steps' => $steps,
            'goBackRoute' => route('actuator.view', ['actuatorId' => $actuatorId]),
            'formActionUrl' => route('actuator.config.update', ['actuatorId' => $actuatorId]),
            'formActionDeleteUrl' => route('actuator.config.delete', ['actuatorId' => $actuatorId])
        ]);
    }

    public function updateConfig(Request $request, $actuatorId): void
    {

        $automationType = $request["automationType"];

        try {

            if($automationType === "time"){
                $data = $request->only(['start_time', 'end_time']);
                $Actuator = new Actuator();
                $actuator = $Actuator->Get($actuatorId);

                $mqtt["vcontrol"] = $actuator["mqtt_id"];
                $mqtt["valor"] = 'on';
                $mqtt["t_inicio"] = date('H:i:s', strtotime($data["start_time"]));
                $mqtt["t_fin"] = date('H:i:s', strtotime($data["end_time"]));
                $mqtt['user_id'] = auth()->id();
                // Publish the MQTT topic
                $MqttConnection = MQTT::connection("publish");
                $MqttConnection->publish(env('MQTT_POST_ACTUATOR_AUTOMATION_TIME'), json_encode($mqtt));
            }

            if($automationType === "variable"){
                $Actuator = new Actuator();
                $actuator = $Actuator->Get($actuatorId);

                $data = $request->only(['min_value', 'max_value', 'action', 'variable_key']);


                $mqtt["vcontrol"] = $actuator["mqtt_id"];
                $mqtt["variable"] = $data["variable_key"];
                $mqtt["valmin"] = $data["min_value"];
                $mqtt["valmax"] = $data["max_value"];
                $mqtt['onwhen'] = $data["action"];
                $mqtt["estanque_id"] = $actuator["pond"]["mqtt_id"];
                $mqtt['unidad_productiva'] = $actuator["pond"]["productiveUnit"]["mqtt_id"];
                $mqtt['user_id'] = auth()->id();
                $mqtt["valor"] = "on";
                // Publish the MQTT topic
                $MqttConnection = MQTT::connection("publish");
                $MqttConnection->publish(env('MQTT_POST_ACTUATOR_AUTOMATION_VARIABLE'), json_encode($mqtt));


            }
        }
        catch (\Exception $exception){
            Log::warning("No se ha podido establecer la orden automatica ".$exception->getMessage());
        }
    }

    public function deleteConfig(ActuatorAutomationTimeDeleteRequest $request, $actuatorId): void
    {
        $data = $request->only(['valor', 'automationType']);

        try {
            $Actuator = new Actuator();
            $actuator = $Actuator->Get($actuatorId);

            if($data["automationType"] === "time"){
                $mqtt["vcontrol"] = $actuator["mqtt_id"];
                $mqtt["valor"] = $data["valor"];

                // Publish the MQTT topic
                $MqttConnection = MQTT::connection("publish");
                $MqttConnection->publish(env('MQTT_POST_ACTUATOR_AUTOMATION_TIME'), json_encode($mqtt));
            }

            if($data["automationType"] === "variable"){
                $mqtt["vcontrol"] = $actuator["mqtt_id"];
                $mqtt["valor"] = $data["valor"];

                // Publish the MQTT topic
                $MqttConnection = MQTT::connection("publish");
                $MqttConnection->publish(env('MQTT_POST_ACTUATOR_AUTOMATION_VARIABLE'), json_encode($mqtt));
            }
        }
        catch (\Exception $exception){
            Log::warning("No se ha podido establecer la orden automatica");
        }
    }

    /**
     * Update the actuator's profile information.
     */
    public function update(ActuatorAutomationTimeCreateRequest $request, $actuatorId)
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
