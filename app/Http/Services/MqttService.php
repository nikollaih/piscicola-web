<?php

namespace App\Http\Services;

use App\Helpers\ActuatorHelper;
use App\Models\Actuator;
use App\Models\StatsReading;
use App\Models\StepStat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use PhpMqtt\Client\Facades\MQTT;

class MqttService {

    public function __construct(){

        $this->MqttConnection = MQTT::connection();
    }

    public function setTurnActuator($topic, $message){
        try {
            $data = json_decode($message, true);
            $mqttId = $data['vcontrol'];
            $mqttStatus = ($data['valor'] == 'on') ? 1 : 0;
            $updated = Actuator::where('mqtt_id', $mqttId)->update(['is_turned_on' => $mqttStatus]);
            $actuator = Actuator::where('mqtt_id', $mqttId)->first();

            if ($updated) {
                $ActuatorHelper = new ActuatorHelper();
                $ActuatorHelper->setActuatorUse($actuator->id, $mqttStatus);
            }

        } catch (\Exception $e) {
            Log::error('Error al procesar el mensaje MQTT: ' . $e->getMessage());
        }
    }

}