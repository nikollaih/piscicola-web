<?php

namespace App\Http\Controllers;

use App\Helpers\SowingNews;
use App\Helpers\ActuatorHelper;
use App\Models\Actuator;
use App\Models\ActuatorAutomationTime;
use App\Models\ActuatorAutomationVariable;
use App\Models\Biomasse;
use App\Models\Pond;
use App\Models\PondStatus;
use App\Models\ProductiveUnit;
use App\Models\Sowing;
use App\Models\StatsReading;
use App\Models\StepStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PhpMqtt\Client\Facades\MQTT;
use App\Services\ReconnectionService;

class MqttController extends Controller
{

    public function __construct()
    {

    }
    public function getTurnActuator($message): void
    {
        try {
            $data = json_decode($message, true);

            if(isset($data["UNIDAD"]) && isset($data["actuadores"])){
                $actuators = $data["actuadores"];

                if(is_array($actuators)){
                    $keys  = array_keys($actuators);
                    $count = count($keys);

                    for ($i = 0; $i < $count; $i++) {
                        $act_mqtt_id = $keys[$i];
                        $act = $actuators[$act_mqtt_id];

                        $mqttStatus  = ($act == 1) ? 1 : 0;

                        $updated  = Actuator::where('mqtt_id', $act_mqtt_id)
                            ->update(['is_turned_on' => $mqttStatus]);

                        $actuator = Actuator::where('mqtt_id', $act_mqtt_id)->first();

                        if ($updated && $actuator) {
                            $ActuatorHelper = new ActuatorHelper();
                            $ActuatorHelper->setActuatorUse($actuator->id, $mqttStatus);
                            Log::info("Cambio de estado actuador: ID-" . $actuator->id);
                        }
                    }
                }
            }
            else {
                Log::log("", "getTurnActuator -> MQTT Actuator ERROR: Cambio de estado actuador datos incorrectos");
            }

        } catch (\Exception $e) {
            Log::error('getTurnActuator -> Error al procesar el mensaje MQTT: ' . $e->getMessage());
        }
    }

    public function setPondStatus($message): void
    {
        try {
            $data = json_decode($message, true);
            $pond = (new Pond())->getPondMQTT($data["estacion_id"], $data["unidad_productiva"]);
            if (!$pond) {
                Log::warning("Estanque no encontrado para estación {$data["estacion_id"]}");
                return;
            }

            PondStatus::create([
                'pond_id' => $data["estacion_id"],
                'status' => $data["status"],
                'event_date' => now()
            ]);

        } catch (\Exception $e) {
            Log::error('setPondStatus -> Error al procesar el mensaje MQTT: ' . $e->getMessage());
        }
    }

    // UPDATE THE COMPLETE STATUS
    public function setAllStatus($message): void
    {
        try {
            $data = json_decode($message, true);

            if (isset($data["estaciones"]) && is_array($data["estaciones"])) {
                foreach ($data["estaciones"] as $sensorId => $data) {
                    $pond = Pond::where('sensor_id', $sensorId)->first();
                    if($pond){
                        $isActive = ($data["conectada"] === true || $data["conectada"] === "true" || $data["conectada"] === "1") ? 1 : 0;

                        PondStatus::create([
                            'pond_id' => $pond->id,
                            'status' => $isActive,
                            'event_date' => now(),
                            'created_at' => now()
                        ]);
                    }
                }
            }

            if (isset($data["actuadores"]) && is_array($data["actuadores"])) {
                foreach ($data["actuadores"] as $mqttId => $value) {
                    $actuator = Actuator::where('mqtt_id', $mqttId)->first();

                    if ($actuator) {
                        $mqttStatus = ($value === true || $value === "true") ? 1 : 0;

                        // Solo actualiza si el estado cambió
                        if ($actuator->is_turned_on != $mqttStatus) {
                            $actuator->is_turned_on = $mqttStatus;
                            $actuator->save();

                            $ActuatorHelper = new ActuatorHelper();
                            $ActuatorHelper->setActuatorUse($actuator->id, $mqttStatus);

                            Log::info("Cambio de estado actuador: ID-" . $actuator->id);
                        }
                    }
                }
            }

        } catch (\Exception $e) {
            Log::error('setAllStatus -> Error al procesar el mensaje MQTT: ' . $e->getMessage());
        }
    }

    public function setActuatorAutomationTime($message): void
    {
        try {
            $data = json_decode($message, true);
            $actuator = Actuator::where('mqtt_id', $data['vcontrol'])->first();

            if (!$actuator) {
                Log::warning("setActuatorAutomationTime -> Actuador no encontrado {$data["vcontrol"]}");
                return;
            }

            if($data["valor"] === 'on') {
                $newAutomation['start_time'] = $data["t_inicio"];
                $newAutomation['end_time'] = $data["t_fin"];
                $newAutomation['user_id'] = $data["user_id"];

                ActuatorAutomationTime::updateOrCreate(
                    ['actuator_id' => $actuator->id], // Condición para buscar
                    $newAutomation // Datos a actualizar o crear
                );
            }

            if($data["valor"] === 'off') {
                ActuatorAutomationTime::where('actuator_id', $actuator->id)->delete();
            }
        } catch (\Exception $e) {
            print_r($e->getMessage());
            Log::error('Error al procesar el mensaje MQTT setActuatorAutomationTime: ' . $e->getMessage());
        }
    }

    public function setActuatorAutomationVariable($message): void
    {
        try {
            $data = json_decode($message, true);
            $actuator = Actuator::where('mqtt_id', $data['vcontrol'])->first();

            if (!$actuator) {
                Log::warning("setActuatorAutomationVariable -> Actuador no encontrado {$data["vcontrol"]}");
                return;
            }

            if($data["valor"] === 'on') {
                $newAutomation['min_value'] = $data["valmin"];
                $newAutomation['max_value'] = $data["valmax"];
                $newAutomation['action'] = $data["onwhen"];
                $newAutomation['variable_key'] = $data["variable"];
                $newAutomation['user_id'] = $data["user_id"];

                ActuatorAutomationVariable::updateOrCreate(
                    ['actuator_id' => $actuator->id], // Condición para buscar
                    $newAutomation // Datos a actualizar o crear
                );
            }

            if($data["valor"] === 'off') {
                ActuatorAutomationVariable::where('actuator_id', $actuator->id)->delete();
            }
        } catch (\Exception $e) {
            print_r($e->getMessage());
            Log::error('Error al procesar el mensaje MQTT setActuatorAutomationTime: ' . $e->getMessage());
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
                $mqtt["timestamp"] = date("Y-m-d H:i:s");
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
            $data = json_decode($message, true);

            if (!$this->isValidPayload($data)) {
                Log::warning('MQTT Lecturas error: Mensaje MQTT inválido o sin medidas.');
                return;
            }

            $pond = (new Pond())->getPondMQTT($data["estanque_id"], $data["unidad_productiva"]);
            if (!$pond) {
                Log::warning("MQTT Lecturas error: Estanque no encontrado para estación {$data["estanque_id"]}");
                return;
            }

            $sowing = (new Sowing())->getByPond($pond->id);
            if (!$sowing) {
                Log::warning("MQTT Lecturas error: Siembra no encontrada para estanque {$pond->id}");
                return;
            }

            $biomasse = (new Biomasse())->Active($sowing->id);
            $stepStatModel = new StepStat();

            $this->processMedida($data, $sowing, $biomasse, $stepStatModel);
            (new ReconnectionService())->checkAndLogReconnection($pond->productiveUnitId);

        } catch (\Exception $e) {
            print_r($e->getMessage());
            Log::error('MQTT Lecturas error: Get readings MQTT controller: ' . $e->getMessage());
        }
    }

    private function isValidPayload(array $data): bool
    {
        return isset($data['valores'], $data['unidad_productiva'], $data['estanque_id'])
            && is_array($data['valores']);
    }

    private function processMedida(array $medida, $sowing, $biomasse, $stepStatModel): void
    {
        if (empty($medida['valores']) || empty($medida['t_medida'])) {
            Log::warning("MQTT Lecturas error: Medida incompleta: " . json_encode($medida));
            return;
        }

        $timestamp = date("Y-m-d H:i:s", strtotime($medida["t_medida"]));

        foreach ($medida["valores"] as $key => $reading) {
            $stepStat = $stepStatModel->getByKeyStep($key, $sowing->step_id);

            if (!$stepStat) {
                continue;
            }

            $newReading = [
                "sowing_id" => $sowing->id,
                "step_id" => $sowing->step_id,
                "biomasse_id" => $biomasse->id,
                "step_stat_id" => $stepStat->id,
                "value" => $reading,
                "topic_time" => $timestamp,
                "triggered_alarm" => $this->isTriggeredAlarm(
                    $reading,
                    $stepStat->value_minimun,
                    $stepStat->value_maximun
                ),
            ];


            $this->storeReadingAndCheckAlarm($newReading);
        }
    }

    private function storeReadingAndCheckAlarm(array $newReading): void
    {
        $statReading = StatsReading::create($newReading);

        if ($statReading && $newReading["triggered_alarm"]) {
            (new SowingNews())->newStatAlarm($statReading);
        }
    }


    public function setManualReadings($message): void
    {
        try {
            $Sowing = new Sowing();
            $StepStat = new StepStat();
            $Biomasse = new Biomasse();
            $Pond = new Pond();

            $data = json_decode($message, true);

            print_r($data);

            if (!isset($data['medidas']) || !is_array($data['medidas'])) {
                Log::warning('Mensaje MQTT sin medidas válidas');
                return;
            }

            $pond = $Pond->getPondMQTT($data["estacion_id"], $data["unidad_productiva"]);

            if (empty($pond)) {
                Log::warning('Estanque no encontrado para estación ' . $data["estacion_id"]);
                return;
            }

            $sowing = $Sowing->getByPond($pond->id);
            if (empty($sowing)) {
                Log::warning('Siembra no encontrada para estanque ' . $pond->id);
                return;
            }

            $activeBiomasse = $Biomasse->Active($sowing->id);

            foreach ($data["medidas"] as $medida) {
                $valores = $medida["valores"];
                $timestamp = $medida["t_evento"];

                foreach ($valores as $key => $reading) {
                    $stepStat = $StepStat->getByKeyStep($key, $sowing->step_id);

                    if (!empty($stepStat)) {
                        $newReading = [
                            "sowing_id" => $sowing->id,
                            "step_id" => $sowing->step_id,
                            "biomasse_id" => $activeBiomasse->id,
                            "step_stat_id" => $stepStat->id,
                            "value" => $reading,
                            "topic_time" => date("Y-m-d H:i:s", strtotime($timestamp)),
                            "triggered_alarm" => $this->isTriggeredAlarm(
                                $reading,
                                $stepStat->value_minimun,
                                $stepStat->value_maximun
                            ),
                        ];

                        /*$statReading = StatsReading::create($newReading);

                        if ($statReading && $newReading["triggered_alarm"] == 1) {
                            $SowingNews = new SowingNews();
                            $SowingNews->newStatAlarm($statReading);
                        }*/
                    }
                }
            }

            print_r("Se ha terminado el proceso de lectura continua");

        } catch (\Exception $e) {
            Log::error('Get readings MQTT controller: ' . $e->getMessage());
        }
    }

    private function isTriggeredAlarm($value, $min, $max): int
    {
        return ($value < $min || $value > $max) ? 1 : 0;
    }

    public function askForManualReadings (Request $request)
    {
        try {
            // Get the actuator id and status
            $actuatorRequest = $request->all();

            $mqtt["tInicio"] = date("Y-m-d H:i:s", strtotime("-10 minutes"));
            $mqtt["tFin"] = date("Y-m-d H:i:s");
            $mqtt["unidad_productiva"] = $actuatorRequest["unidad_productiva"];
            $mqtt["estacion_id"] = $actuatorRequest["estacion_id"];
            $mqtt["chunkSize"] = 10;
            // Publish the MQTT topic
            $MqttConnection = MQTT::connection("publish");
            $MqttConnection->publish(env('MQTT_POST_READINGS_MANUAL'), json_encode($mqtt));
            // Return a confirmation message
            return response()->json(["msg" => "Se ha enviado una peticón de lecturas"], 200);

        } catch (\Exception $e) {
            // Return a confirmation message
            return response()->json(["msg" => "Ha ocurrido un error, intente de nuevo más tarde", "error" => $e->getMessage()], 500);
        }
    }

    // Solicita el estado global de la unidad productiva
    public function askForFullStatus (Request $request)
    {
        try {
            // Publish the MQTT topic
            $MqttConnection = MQTT::connection("publish");
            $MqttConnection->publish(env('MQTT_FILANDIA_STATUS'), "1");
            // Return a confirmation message
            return response()->json(["msg" => "Se ha enviado una peticón para conocer el estado global, en breve se verá reflejado"], 200);

        } catch (\Exception $e) {
            // Return a confirmation message
            return response()->json(["msg" => "Ha ocurrido un error, intente de nuevo más tarde", "error" => $e->getMessage()], 500);
        }
    }
}
