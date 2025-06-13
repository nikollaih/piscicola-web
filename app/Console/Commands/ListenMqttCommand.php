<?php

namespace App\Console\Commands;

use App\Http\Controllers\MqttController;
use App\Models\AuditorMqttConnection;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use PhpMqtt\Client\Facades\MQTT;

class ListenMqttCommand extends Command
{

    protected $signature = 'mqtt:listen';
    protected $description = 'Listen to MQTT broker';
    private MqttController $MqttController;

    public function __construct()
    {
        parent::__construct();

        $this->MqttController = new MqttController();
    }

    public function handle()
    {
        $mqttConnectionFile = storage_path('app/mqtt_connection.json');

        // Check if there is an existing MQTT connection
        if (File::exists($mqttConnectionFile)) {
            // If there is an existing MQTT connection, close it
            $previousConnectionId = json_decode(File::get($mqttConnectionFile), true);
            MQTT::disconnect($previousConnectionId);
            AuditorMqttConnection::create(["register_time" => date('Y-m-d H:i:s'), "status" => 0, "failed" => "Disconnected by json file"]);
        }

        try {
            echo sprintf('Conectado');
            AuditorMqttConnection::create(["register_time" => date('Y-m-d H:i:s'), "status" => 1]);

            $mqtt = MQTT::connection();

            $connectionId = $mqtt->getClientId();

            // Save the ID of the current MQTT connection
            File::put($mqttConnectionFile, json_encode($connectionId));

            $mqtt->subscribe(env('MQTT_GET_ACTUATORS_STATUS'), function (string $topic, string $message, $retained) {
                if($retained != 1) {
                    print_r("Actuador");
                    $this->MqttController->getTurnActuator($message);
                }
            }, 1);

            $mqtt->subscribe(env('MQTT_GET_READINGS'), function (string $topic, string $message, $retained) {
                print_r("Lectura automatica");
                if($retained != 1) {
                    print_r("Lectura automatica");
                    $this->MqttController->setReadings($message);
                }
            }, 1);

            $mqtt->subscribe(env('MQTT_GET_READINGS_MANUAL'), function (string $topic, string $message, $retained) {
                if($retained != 1) {
                    print_r("Lectura manual");
                    $this->MqttController->setReadings($message);
                }
            }, 1);

            $mqtt->subscribe(env('MQTT_GET_POND_STATUS'), function (string $topic, string $message, $retained) {
                if($retained != 1) {
                    print_r("Pond status");
                    $this->MqttController->setPondStatus($message);
                }
            }, 1);

            $mqtt->subscribe(env('MQTT_FILANDIA_STATUS'), function (string $topic, string $message, $retained) {
                if($retained != 1) {
                    print_r("All status");
                    $this->MqttController->setAllStatus($message);
                }
            }, 1);

            $mqtt->subscribe(env('MQTT_POST_ACTUATOR_AUTOMATION_TIME'), function (string $topic, string $message, $retained) {
                if($retained != 1) {
                    print_r("Actuator automation time");
                    $this->MqttController->setActuatorAutomationTime($message);
                }
            }, 1);

            $mqtt->subscribe(env('MQTT_POST_ACTUATOR_AUTOMATION_VARIABLE'), function (string $topic, string $message, $retained) {
                if($retained != 1) {
                    print_r("Actuator automation variable");
                    $this->MqttController->setActuatorAutomationVariable($message);
                }
            }, 1);

            $mqtt->loop(true);

        } catch (\Exception $e) {
            echo sprintf('No es posible conectar'. $e->getMessage());
            AuditorMqttConnection::create(["register_time" => date('Y-m-d H:i:s'), "status" => 0, "failed" => $e->getMessage()]);
        }
    }
}
