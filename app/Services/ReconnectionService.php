<?php


namespace App\Services;

use App\Mail\ReconnectionMail;
use App\Models\ProductiveUnit;
use App\Models\StatsReading;
use App\Models\StatAlertLog;
use App\Models\Reconnection;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ReconnectionService
{
    protected ExpoPushNotificationService $expoPush;

    public function __construct()
    {
        $this->expoPush = app(ExpoPushNotificationService::class);
    }

    public function checkAndLogReconnection(int $productiveUnitId): void
    {
        try {
            $latestReading = StatsReading::latestByProductiveUnit($productiveUnitId);

            $ProductiveUnit = new ProductiveUnit();
            $emails = ['no-reply@piscicola.redesystemco.com'];

            if (!$latestReading) {
                Log::info("No reading found for productive unit ID: $productiveUnitId");
                return;
            }

            $alertLog = StatAlertLog::where('stats_reading_id', $latestReading->id)->first();

            if ($alertLog) {
                $lastConnection = $alertLog->created_at;
                $reconnection = now();

                $durationInMinutes = Carbon::parse($lastConnection)->diffInMinutes($reconnection);

                $data = [
                    'productive_unit_id' => $productiveUnitId,
                    'last_connection_date' => $lastConnection,
                    'reconnection_date' => $reconnection,
                    'duration' => $durationInMinutes,
                ];

                Reconnection::create($data);

                $productiveUnit = $ProductiveUnit->Get($productiveUnitId);

                if (!is_null($productiveUnit) && $productiveUnit->Users->isNotEmpty()) {
                    foreach ($productiveUnit->Users as $user) {
                        if (!empty($user->email)) {
                            $emails[] = $user->email;
                        }
                    }
                }

                // Enviar correo
                Mail::to($emails)->send(new ReconnectionMail($data));

                // Preparar notificaciones push
                $notifications = [];
                foreach ($productiveUnit->Users as $user) {
                    foreach ($user->deviceTokens ?? [] as $deviceToken) {
                        $notifications[] = [
                            'to' => $deviceToken->token,
                            'title' => '✅ Conexión restablecida',
                            'body' => 'Conexión restablecida despues de '.$data["duration"]. ' minutos.',
                            'sound' => 'default',
                            'data' => [
                                'tipo' => 'alerta_reconexion',
                            ],
                        ];
                    }
                }

                // Enviar notificaciones si hay tokens
                if (!empty($notifications)) {
                    $this->expoPush->send($notifications);
                }

                Log::info("Reconexión registrada con duración de {$durationInMinutes} minutos para unidad productiva #$productiveUnitId");
            } else {
                Log::info("Reading already logged for stat ID: {$latestReading->id}, no se crea reconexión.");
            }
        }
        catch (\Exception $e) {
            print_r("Nuevo error: ".$e->getMessage());
            Log::error("Nuevo error: ".$e->getMessage());
        }
    }
}
