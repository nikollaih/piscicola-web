<?php

namespace App\Http\Services;

use App\Helpers\ActuatorHelper;
use App\Models\Actuator;
use App\Models\StatsReading;
use App\Models\StepStat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\SetTurnActuatorRequest;
use PhpMqtt\Client\Facades\MQTT;

class MqttService {

    public function __construct(){

        //temporay unnecesary
        //$this->MqttConnection = MQTT::connection();
    }

    public function setTurnActuator(SetTurnActuatorRequest $request){
        try {
            // Get the actuator information 
            $actuator = Actuator::where('mqtt_id', $request->mqtt_id)->first();

            if($actuator){
                $mqtt["vcontrol"] = $request->mqtt_id;
                $mqtt["valor"] = $request->status;
                // Publish the MQTT topic
                $MqttConnection = MQTT::connection("publish");
                $MqttConnection->publish(env('MQTT_TURN_ACTUATOR'), json_encode($mqtt));
                // Return a confirmation message
                return ["msg" => "El estado del actuador ha sido cambiado con exito","success" => true];
            }

            //TODO: revisar si es realmente necesario ya que el SetTurnActuatorRequest ya verifica si existe
            return ["msg" => "El actuador no existe","success" => false];
        } catch (\Exception $e) {
            return ["msg" => "No ha sido posible cambiar el estado del actuador  ". $e->getMessage(),"success" => false];
        }
    }

}