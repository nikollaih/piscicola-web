<?php

namespace App\Http\Controllers;

use App\Mail\StatsAlertMail;
use App\Models\ProductiveUnit;
use App\Models\StatAlertLog;
use App\Models\StatsReading;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;

class CronJobs extends Controller
{
    //
    public function index() {
        Artisan::call('mqtt:listen');
        return true;
    }

    public function checkLatestReadings()
    {
        $StatReadings = new StatsReading();
        $ProductiveUnit = new ProductiveUnit();
        $stats = $StatReadings->latestGeneral();

        if (!$stats->isEmpty()) {
            foreach ($stats as $stat) {
                $emails = ["no-reply@piscicola.redesystemco.com", "nikollaihernandezgamus@gmail.com"];
                $localTime = Carbon::parse($stat->topic_time);
                $checkInterval = (int) $stat->Sowing->check_interval;

                // Verifica si han pasado al menos X minutos
                if ($localTime->diffInMinutes(now()) >= $checkInterval && $checkInterval > 0) {
                    // Busca último log del stat
                    $existingLog = StatAlertLog::where('stats_reading_id', $stat->id)
                        ->latest('created_at')
                        ->first();

                    if ($existingLog) {
                        // Validar si han pasado al menos 30 minutos desde el último envío
                        $lastSentAt = Carbon::parse($existingLog->updated_at);
                        $minutesSinceLast = $lastSentAt->diffInMinutes(now());

                        if ($existingLog->counter >= 3 || $minutesSinceLast < 30) {
                            continue;
                        }
                    }

                    $productiveUnit = $ProductiveUnit->Get($stat->Sowing->productive_unit_id);

                    if (!is_null($productiveUnit) && $productiveUnit->Users->isNotEmpty()) {
                        foreach ($productiveUnit->Users as $user) {
                            if (!empty($user->email)) {
                                $emails[] = $user->email;
                            }
                        }

                        $emails = array_unique($emails);

                        // Enviar correo
                        //Mail::to($emails)->send(new StatsAlertMail($stat));

                        // Actualizar o crear log
                        if ($existingLog) {
                            $existingLog->update(['counter' => $existingLog->counter + 1]);
                        } else {
                            StatAlertLog::create([
                                'stats_reading_id' => $stat->id,
                                'stat_data' => json_encode($stat->toArray(), JSON_PRETTY_PRINT),
                                'emails' => serialize($emails),
                                'counter' => 1,
                                'created_at' => now(),
                            ]);
                        }
                    }
                }
            }
        }
    }
}
