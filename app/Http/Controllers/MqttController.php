<?php

namespace App\Http\Controllers;

use App\Helpers\SowingNews;
use App\Helpers\ActuatorHelper;
use App\Http\Services\PushNotificationsService;
use App\Models\Actuator;
use App\Models\Biomasse;
use App\Models\Pond;
use App\Models\Sowing;
use App\Models\StatsReading;
use App\Models\StepStat;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PhpMqtt\Client\Facades\MQTT;

class MqttController extends Controller
{

    private PushNotificationsService $pushNotificationsService;
    private User $User;

    public function __construct()
    {
        $this->pushNotificationsService = new PushNotificationsService();
        $this->User = new User();
    }
    public function getTurnActuator($topic, $message): void
    {
        try {
            $data = json_decode($message, true);
            $mqttId = $data['vcontrol'];
            $mqttStatus = ($data['valor'] == 'on') ? 1 : 0;
            $updated = Actuator::where('mqtt_id', $mqttId)->update(['is_turned_on' => $mqttStatus]);
            $actuator = Actuator::where('mqtt_id', $mqttId)->first();

            if ($updated) {
                $ActuatorHelper = new ActuatorHelper();
                $ActuatorHelper->setActuatorUse($actuator->id, $mqttStatus);
                Log::log("", "Cambio de estado actuador: ID-".$actuator->id);
            }

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
                $mqtt["vcontrol"] = $actuatorRequest["mqtt_id"];
                $mqtt["valor"] = $actuatorRequest["status"];
                // Publish the MQTT topic
                $MqttConnection = MQTT::connection("publish");
                $MqttConnection->publish(env('MQTT_TURN_ACTUATOR'), json_encode($mqtt));
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
        try {
            $Sowing = new Sowing();
            $StepStat = new StepStat();
            $Biomasse = new Biomasse();
            $Pond = new Pond();

            $data = json_decode($message, true);

            if(count($data["valores"])){
                //TODO change the constant id
                //$pond = Pond::where('mqtt_id', $data["pond_id"])->first();
                $pond = $Pond->getPondMQTT($data["estanque_id"], $data["unidad_productiva"]);

                $sowing = $Sowing->getByPond($pond->id);

                if(!empty($pond)){
                    if(!empty($sowing)){

                        $activeBiomasse = $Biomasse->Active($sowing->id);
                        $newReading["sowing_id"] = $sowing->id;
                        $newReading["step_id"] = $sowing->step_id;
                        $newReading["biomasse_id"] = $activeBiomasse->id;

                        foreach ($data["valores"] as $key => $reading) {
                            $stepStat = $StepStat->getByKeyStep($key, $sowing->step_id);

                            if(!empty($stepStat)) {

                                $newReading["step_stat_id"] = $stepStat->id;
                                $newReading["value"] = $reading;
                                $newReading["topic_time"] = date("Y-m-d H:i:s", strtotime($data["t_medida"]));
                                $newReading["triggered_alarm"] = $this->isTriggeredAlarm($reading, $stepStat->value_minimun, $stepStat->value_maximun);

                                $statReading = StatsReading::create($newReading);

                                if($statReading && $newReading["triggered_alarm"] == 1){
                                    $SowingNews = new SowingNews();
                                    $SowingNews->newStatAlarm($statReading);
                                    // Prepare the push notification sender to receivers
                                    self::preparePushNotification($stepStat, $reading, $sowing);
                                }
                            }
                        }
                    }
                }
            }
        }
        catch (\Exception $e) {
            // Registra la excepción en el registro
            Log::error('Get readings MQTT controller: ' . $e->getMessage());
        }
    }

    private function isTriggeredAlarm($value, $min, $max): int
    {
        return ($value < $min || $value > $max) ? 1 : 0;
    }

    // Send the push notifications for triggered alarms
    private function preparePushNotification($stepStat, $reading, $sowing): void {
        $users = $this->User->getFCMTokens($sowing->productive_unit_id);

        if(!empty($users)){
            $title = "Alarma";
            $body = "El parámetro $stepStat->name ha registrado una lectura de $reading en la cosecha: $sowing->name";
            foreach ($users as $user) {
                $this->pushNotificationsService->sendNotification($user->fcm_token, $title, $body);
            }
        }
    }
}
