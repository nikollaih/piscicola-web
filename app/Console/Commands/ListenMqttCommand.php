<?php


namespace App\Console\Commands;

use App\Http\Controllers\MqttController;
use App\Models\AuditorMqttConnection;
use Illuminate\Console\Command;
use PhpMqtt\Client\Facades\MQTT;

class ListenMqttCommand extends Command
{

    protected $signature = 'mqtt:listen';
    protected $description = 'Listen to MQTT broker';
    private MqttController $MqttController;
    private ?\PhpMqtt\Client\Contracts\MqttClient $mqtt = null;
    private string $lockFilePath;

    public function __construct()
    {
        parent::__construct();

        $this->MqttController = new MqttController();
        $this->lockFilePath = storage_path('app/mqtt-listener.lock');
    }

    public function handle()
    {
        if (!file_exists($this->lockFilePath)) {
            // Acquire lock
            touch($this->lockFilePath);

            try {
                $this->mqtt = MQTT::connection();

                echo sprintf('Conectado');
                AuditorMqttConnection::create([
                    "register_time" => date('Y-m-d H:i:s'),
                    "status" => 1
                ]);

                $this->mqtt->subscribe(env('MQTT_TURN_ACTUATOR'), function (string $topic, string $message) {
                    print_r("Actuador");
                    $this->MqttController->getTurnActuator($topic, $message);
                }, 1);

                $this->mqtt->subscribe(env('MQTT_GET_READINGS'), function (string $topic, string $message) {
                    print_r("Lectura");
                    $this->MqttController->setReadings($message);
                }, 1);

                $this->mqtt->loop(true);

            } catch (\Exception $e) {
                echo sprintf('No es posible conectar: %s', $e->getMessage());
                AuditorMqttConnection::create([
                    "register_time" => date('Y-m-d H:i:s'),
                    "status" => 0,
                    "failed" => $e->getMessage()
                ]);
            } finally {
                // Release lock
                if (file_exists($this->lockFilePath)) {
                    unlink($this->lockFilePath);
                }
            }
        } else {
            // Another instance of MQTT listener is already running.
            echo "Another instance of MQTT listener is already running.\n";
            AuditorMqttConnection::create([
                "register_time" => date('Y-m-d H:i:s'),
                "status" => 0,
                "failed" => "Another instance of MQTT listener is already running."
            ]);
            return Command::FAILURE;
        }
    }
}
