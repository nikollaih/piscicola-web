<?php

namespace App\Http\Controllers;

use App\Http\Requests\SetActuatorMqttRequest;
use App\Models\Actuator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use PhpMqtt\Client\Facades\MQTT;

class MqttController extends Controller
{
    public function __construct()
    {
        $this->MqttConnection = MQTT::connection();
    }
    public function getTurnActuator($topic, $message): void
    {
        try {
            echo sprintf('%s', $message);
            $data = json_decode($message, true);
            $mqttId = $data['mqtt_id'];
            $mqttStatus = $data['status'];

            Actuator::where('mqtt_id', $mqttId)->update(['is_turned_on' => $mqttStatus]);

        } catch (\Exception $e) {
            Log::error('Error al procesar el mensaje MQTT: ' . $e->getMessage());
        }
    }

    // Change the actuator status to turned on/off
    public function setTurnActuator (Request $request)
    {
        try {
            // Get the actuator id and status
            $actuatorRequest = $request->all();
            $actuator = Actuator::where('mqtt_id', $actuatorRequest["mqtt_id"])->first();

            if($actuator){
                // Publish the MQTT topic
                MQTT::publish(env('MQTT_TURN_ACTUATOR'), json_encode($actuatorRequest));

                // Return a confirmation message
                return response()->json(["msg" => "El estado del actuador ha sido cambiado con exito"], 200);
            }

            // Return a confirmation message
            return response()->json(["msg" => "El actuador no existe"], 500);
        } catch (\Exception $e) {
            // Return a confirmation message
            return response()->json(["msg" => "No ha sido posible cambiar el estado del actuador"], 500);
        }
    }
}
