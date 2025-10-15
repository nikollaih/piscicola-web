<?php


namespace App\Http\Controllers;

use App\Models\Actuator;
use App\Models\Device;
use App\Models\Pond;
use App\Models\StatsReading;

class DashboardController extends Controller
{
    public function index()
    {
        $Pond = new Pond();
        $Actuator = new Actuator();
        $Device = new Device();
        $StatsReading = new StatsReading();
        $ponds = $Pond->getAll();
        $actuators = $Actuator->getAll();
        $devices = $Device->getAllWithLatestMaintenance();
        $latestReading = $StatsReading->latestMQTT();

        foreach ($ponds as $pond) {
            $pond->active_sowing = $Pond->getActiveSowing($pond->id, true);
        }

        return \inertia('Dashboard', [
            'ponds' => $ponds,
            'actuators' => $actuators,
            'devices' => $devices,
            'latestReading' => $latestReading,
            'showReadingsAlertAfter' => env('SHOW_READINGS_ALERT_AFTER_MINUTES') ?? 30,
            'csrfToken' => csrf_token()
        ]);
    }
}
