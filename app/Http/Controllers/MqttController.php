<?php

namespace App\Http\Controllers;

use App\Http\Requests\SetActuatorMqttRequest;
use App\Models\Actuator;
use App\Models\Biomasse;
use App\Models\Pond;
use App\Models\Sowing;
use App\Models\StatsReading;
use App\Models\StepStat;
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

    public function setReadings($message): void
    {

        $Sowing = new Sowing();
        $StepStat = new StepStat();
        $Biomasse = new Biomasse();
echo $message;
        $data = json_decode($message, true);
        echo count($data["readings"]);
        if(count($data["readings"])){
            echo "NHG";
            $pond = Pond::where('mqtt_id', $data["pond_id"])->first();
            $sowing = $Sowing->getByPond($pond->id);

            if(!empty($pond)){
                if(!empty($sowing)){

                    $activeBiomasse = $Biomasse->Active($sowing->id);
                    $newReading["sowing_id"] = $sowing->id;
                    $newReading["step_id"] = $sowing->step_id;
                    $newReading["biomasse_id"] = $activeBiomasse->id;

                    for ($i = 0; $i < count($data["readings"]); $i++) {

                        $reading = $data["readings"][$i];
                        $stepStat = $StepStat->getByKeyStep($reading["key"], $sowing->step_id);
                        echo json_encode($newReading);
                        if(!empty($stepStat)) {

                            $newReading["step_stat_id"] = $stepStat->id;
                            $newReading["value"] = $reading["value"];
                            $newReading["topic_time"] = date("Y-m-d h:i:s", strtotime($reading["topic_time"]));

                            $newReading["triggered_alarm"] = $this->isTriggeredAlarm($reading["value"], $stepStat->value_minimun, $stepStat->value_maximun);



                            StatsReading::create($newReading);

                        }
                    }


                }
            }
        }
    }

    private function isTriggeredAlarm($value, $min, $max): int
    {
        return ($value < $min || $value > $max) ? 1 : 0;
    }
}
