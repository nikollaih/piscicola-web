<?php

namespace App\Helpers;

use App\Models\Actuator;
use App\Models\ActuatorUse;
use App\Models\Biomasse;
use App\Models\Sowing;

class ActuatorHelper
{
    public function setActuatorUse($actuatorId, $status) {
        try {
            $Actuator = new Actuator();
            $Sowing = new Sowing();
            $Biomasse = new Biomasse();

            $actuator = $Actuator->Get($actuatorId);
            $sowing = $Sowing->getByPond($actuator->pond_id);
            $biomasse = $Biomasse->Active($sowing->id);

            if($status === 1) {
                $use["actuator_id"] = $actuatorId;
                $use["biomasse_id"] = $biomasse->id;
                $use["turned_on"] = date("Y-m-d H:i:s");

                ActuatorUse::create($use);
            }

            if($status === 0) {
                $ActuatorUse = new ActuatorUse();
                $activeActuator = $ActuatorUse->Get($actuatorId);

                if(!$activeActuator->turned_off) {
                    $datetime1 = strtotime($activeActuator->turned_on);
                    $datetime2 = strtotime(date('Y-m-d H:i:s'));
                    $use["minutes"] = round(($datetime2 - $datetime1) / 60);
                    $use["cost"] = $use["minutes"] * $actuator->cost_by_minute;
                    $use["turned_off"] = date("Y-m-d H:i:s");

                    ActuatorUse::where('id', $activeActuator->id)->update($use);
                }
            }
        }
        catch (\Exception $e) {
            print_r('Get readings MQTT controller: ' . $e->getMessage());
        }
    }
}
