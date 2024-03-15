<?php

namespace App\Console\Commands;

use App\Http\Controllers\MqttController;
use Illuminate\Console\Command;
use PhpMqtt\Client\Facades\MQTT;

class ListenMqttCommand extends Command
{

    protected $signature = 'mqtt:listen';
    protected $description = 'Listen to MQTT broker';
    private MqttController $MqttController;
    private \PhpMqtt\Client\Contracts\MqttClient $mqtt;
    public function __construct()
    {
        parent::__construct();

        $this->MqttController = new MqttController();
        $this->mqtt = MQTT::connection();
    }

    public function handle()
    {
        try {
            $this->mqtt->subscribe(env('MQTT_TURN_ACTUATOR'), function (string $topic, string $message) {
                $this->MqttController->getTurnActuator($topic, $message);
            }, 1);

            $this->mqtt->subscribe(env('MQTT_GET_READINGS'), function (string $topic, string $message) {
                $this->MqttController->setReadings($message);
            }, 1);

        } catch (\Exception $e) {
            echo sprintf('No es posible conectar'. $e->getMessage());
        }

        $this->mqtt->loop(true);

    }
}
