<?php

namespace App\Console\Commands;

use App\Http\Controllers\MqttController;
use Illuminate\Console\Command;
use PhpMqtt\Client\Facades\MQTT;

class ListenMqttCommand extends Command
{
    protected $signature = 'mqtt:listen';
    protected $description = 'Listen to MQTT broker';

    public function handle()
    {
        try {
            $MqttController = new MqttController();
            $mqtt = MQTT::connection();
            $mqtt->subscribe(env('MQTT_TURN_ACTUATOR'), function (string $topic, string $message) use ($MqttController) {
                $MqttController->getTurnActuator($topic, $message);
            }, 1);
            $mqtt->loop(true);

        } catch (\Exception $e) {
            echo sprintf('No es posible conectar');
        }

    }
}
