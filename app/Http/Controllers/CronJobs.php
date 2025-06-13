<?php

namespace App\Http\Controllers;

use App\Mail\StatsAlertMail;
use App\Models\ProductiveUnit;
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

    public function checkLatestReadings() {
        $StatReadings = new StatsReading();
        $ProductiveUnit = new ProductiveUnit();
        $stats = $StatReadings->latestGeneral();

        if (!$stats->isEmpty()) {
            foreach ($stats as $stat) {
                $emails = ["no-reply@piscicola.redesystemco.com", "nikollaihernandezgamus@gmail.com"];
                $localTime = Carbon::parse($stat->topic_time);
                print_r($localTime->diffInMinutes(now()));
die();
                if ($localTime->diffInMinutes(now()) >= env("LATEST_READINGS_PERIOD")?? 10) {
                    $productiveUnit = $ProductiveUnit->Get($stat->Sowing->productive_unit_id);

                    if (!is_null($productiveUnit) && $productiveUnit->Users->isNotEmpty()) {
                        foreach ($productiveUnit->Users as $user) {
                            if (!empty($user->email)) {
                                $emails[] = $user->email;
                            }
                        }

                        // Elimina duplicados por si acaso
                        $emails = array_unique($emails);

                        // Enviar correo a todos los emails recogidos
                        Mail::to($emails)->send(new StatsAlertMail($stat));
                    }
                }
            }
        }
    }
}
