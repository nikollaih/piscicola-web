<?php


namespace App\Http\Controllers;

use App\Models\Actuator;
use App\Models\Device;
use App\Models\Pond;

class DashboardController extends Controller
{
    public function index()
    {
        $Pond = new Pond();
        $Actuator = new Actuator();
        $Device = new Device();
        $ponds = $Pond->getAll();
        $actuators = $Actuator->getAll();
        $devices = $Device->getAllWithLatestMaintenance();

        return \inertia('Dashboard', [
            'ponds' => $ponds,
            'actuators' => $actuators,
            'devices' => $devices,
            'csrfToken' => csrf_token()
        ]);
    }
}
