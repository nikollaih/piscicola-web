<?php

namespace App\Http\Controllers;

use App\Helpers\SowingNews;
use App\Mail\StatsAlertMail;
use App\Models\ProductiveUnit;
use App\Models\SensorMaintenance;
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

            if(env('ENABLED_EMAIL_ALERTS') == "TRUE") {
                // Enviar correo de alerta
                Mail::to($emails)->send(new StatsAlertMail($stat));
            }

            // Preparar notificaciones push
            $notifications = [];
            foreach ($productiveUnit->Users as $user) {
                foreach ($user->deviceTokens ?? [] as $deviceToken) {
                    $notifications[] = [
                        'to' => $deviceToken->token,
                        'title' => '⚠️ No se han detectado lecturas',
                        'body' => 'Hay lecturas sin actualizar en '.$stat->Sowing->Pond->name.'.',
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
                if(env('ENABLED_PUSH_NOTIFICATIONS_ALERTS') == "TRUE") {
                    $this->expoPush->send($notifications);
                }
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

    /**
     * Envía un “digest” de mantenimientos próximos/vencidos agrupado por unidad productiva.
     *
     * @param Request $request  (opcional) days_ahead para el umbral
     */
    public function notifyMaintenancesDigest(Request $request)
    {
        $daysAhead  = (int) ($request->input('days_ahead', env('MAINTENANCE_ALERT_DAYS_AHEAD', 7)));
        $now        = now();
        $limitDate  = $now->copy()->addDays($daysAhead);

        // 1) Trae un (1) mantenimiento por estanque: el último por pond (tu método del modelo)
        $latest = SensorMaintenance::latestActivePerPondDesc(); // collection

        if ($latest->isEmpty()) {
            return;
        }

        // 2) Filtra a los que están vencidos o a vencer (<= $limitDate)
        $due = $latest->filter(function (SensorMaintenance $m) use ($limitDate) {
            return $m->next_maintenance_at && $m->next_maintenance_at->lte($limitDate);
        });

        if ($due->isEmpty()) {
            return;
        }

        // 3) Agrupa por unidad productiva
        $byUnit = $due->groupBy(fn ($m) => optional($m->pond)->productive_unit_id);

        foreach ($byUnit as $productiveUnitId => $maintenances) {
            if (!$productiveUnitId) {
                continue;
            }

            // Cargamos usuarios y tokens de la unidad
            $productiveUnit = ProductiveUnit::with(['Users.deviceTokens'])->find($productiveUnitId);
            if (!$productiveUnit || $productiveUnit->Users->isEmpty()) {
                continue;
            }

            // 4) Construye el payload del digest (ordenado desc por next_maintenance_at)
            $items = $maintenances
                ->sortByDesc('next_maintenance_at')
                ->map(function (SensorMaintenance $m) use ($now) {
                    return [
                        'pond_name'           => $m->pond?->name,
                        'sensor_name'         => $m->sensor_name,
                        'next_maintenance_at' => optional($m->next_maintenance_at)->toDateTimeString(),
                        'overdue'             => $m->next_maintenance_at && $m->next_maintenance_at->lt($now),
                    ];
                })
                ->values()
                ->all();

            // 5) Emails únicos
            $emails = $productiveUnit->Users->pluck('email')->filter()->unique()->values()->all();
            if (empty($emails)) {
                $emails = ['no-reply@piscicola.redesystemco.com'];
            }

            // 6) Enviar email (un solo correo con todos los ponds de la unidad)
            if (env('ENABLED_EMAIL_ALERTS') == "TRUE") {
                Mail::to($emails)->send(new \App\Mail\MaintenanceDigestMail(
                    productiveUnit: $productiveUnit,
                    items: $items,
                    daysAhead: $daysAhead
                ));
            }

            // 7) Preparar push (resumen en un solo mensaje por usuario)
            $preview = collect($items)->map(function ($it) {
                $date = Carbon::parse($it['next_maintenance_at'])->isoFormat('DD/MM HH:mm');
                $badge = $it['overdue'] ? '⚠️' : '⏰';
                return "{$badge} {$it['pond_name']} ({$date})";
            })->take(5)->implode(' • ');
            $extra = max(count($items) - 5, 0);
            $body  = $preview . ($extra ? " +{$extra} más" : '');

            $notifications = [];
            foreach ($productiveUnit->Users as $user) {
                foreach ($user->deviceTokens ?? [] as $token) {
                    $notifications[] = [
                        'to'    => $token->token,
                        'title' => "Mantenimientos próximos ({$productiveUnit->name})",
                        'body'  => $body ?: 'Hay mantenimientos próximos en tu unidad.',
                        'sound' => 'default',
                        'data'  => [
                            'tipo'                 => 'mantenimiento_digest',
                            'productive_unit_id'   => $productiveUnit->id,
                            'count'                => count($items),
                            'days_ahead'           => $daysAhead,
                        ],
                    ];
                }
            }

            if (!empty($notifications) && env('ENABLED_PUSH_NOTIFICATIONS_ALERTS') == "TRUE") {
                $this->expoPush->send($notifications);
            }
        }
    }
}
