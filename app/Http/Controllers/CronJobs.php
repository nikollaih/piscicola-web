<?php

namespace App\Http\Controllers;

use App\Helpers\SowingNews;
use App\Mail\StatsAlertMail;
use App\Models\ProductiveUnit;
use App\Models\StatAlertLog;
use App\Models\StatsReading;
use App\Services\ExpoPushNotificationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;

class CronJobs extends Controller
{
    protected ExpoPushNotificationService $expoPush;

    public function __construct()
    {
        $this->expoPush = app(ExpoPushNotificationService::class);
    }

    // Lanza escucha de MQTT
    public function index()
    {
        Artisan::call('mqtt:listen');
        return true;
    }

    public function checkLatestReadings()
    {
        $stats = (new StatsReading())->latestGeneral();

        if ($stats->isEmpty()) return;

        foreach ($stats as $stat) {
            $emails = ['no-reply@piscicola.redesystemco.com'];
            $localTime = Carbon::parse($stat->topic_time);
            $checkInterval = (int) $stat->Sowing->check_interval;

            // Verifica si han pasado suficientes minutos desde la última lectura
            if ($checkInterval <= 0 || $localTime->diffInMinutes(now()) < $checkInterval) {
                continue;
            }

            $existingLog = StatAlertLog::where('stats_reading_id', $stat->id)
                ->latest('created_at')
                ->first();

            if ($existingLog) {
                $lastSentAt = Carbon::parse($existingLog->updated_at ?? $existingLog->created_at);
                $minutesSinceLast = $lastSentAt->diffInMinutes(now());

                if ($existingLog->counter >= 3 || $minutesSinceLast < 30) {
                    continue;
                }
            }

            $productiveUnit = (new ProductiveUnit())->Get($stat->Sowing->productive_unit_id);
            if (is_null($productiveUnit) || $productiveUnit->Users->isEmpty()) {
                continue;
            }

            // Reunir correos
            foreach ($productiveUnit->Users as $user) {
                if (!empty($user->email)) {
                    $emails[] = $user->email;
                }
            }
            $emails = array_unique($emails);

            // Enviar correo de alerta
            Mail::to($emails)->send(new StatsAlertMail($stat));

            // Preparar notificaciones push
            $notifications = [];
            foreach ($productiveUnit->Users as $user) {
                foreach ($user->deviceTokens ?? [] as $deviceToken) {
                    $notifications[] = [
                        'to' => $deviceToken->token,
                        'title' => '⚠️ No se han detectado lecturas: ' . $stat->Sowing->Pond->name,
                        'body' => 'Hay lecturas sin actualizar en uno de los estanques de la unidad productiva.',
                        'sound' => 'default',
                        'data' => [
                            'tipo' => 'alerta_estadistica',
                            'sowing_id' => $stat->Sowing->id,
                        ],
                    ];
                }
            }

            // Enviar notificaciones si hay tokens
            if (!empty($notifications)) {
                $this->expoPush->send($notifications);
            }

            // Registrar noticia en la siembra
            (new SowingNews())->newStatsReadingsLost([
                'sowing_id' => $stat->Sowing->id,
                'topic_time' => $localTime,
            ]);

            // Actualizar o crear log
            if ($existingLog) {
                $existingLog->increment('counter');
            } else {
                StatAlertLog::create([
                    'stats_reading_id' => $stat->id,
                    'stat_data' => json_encode($stat->toArray(), JSON_PRETTY_PRINT),
                    'emails' => serialize($emails),
                    'counter' => 1,
                ]);
            }
        }
    }
}
