<?php

namespace App\Helpers;

use App\Models\Biomasse;
use App\Models\Mortality;
use App\Models\SowingNew;
use App\Models\StatsReading;
use App\Models\SupplyUse;
use Illuminate\Support\Facades\Auth;

class SowingNews
{
    public function addSowingNews ($sowingId, $description, $title) {
        $user = Auth::user();
        $sowingNews["sowing_id"] = $sowingId;
        $sowingNews["title"] = $title;
        $sowingNews["description"] = $description;

        return SowingNew::create($sowingNews);
    }

    public function newFeeding ($feedingId) {
        $user = Auth::user();
        $Feeding = new SupplyUse();
        $feeding = $Feeding->Get($feedingId);

        $description = "<p><strong>".$user->name."</strong> ha alimentado la cosecha con <strong>".$feeding->quantity.$feeding->Supply->MeasurementUnit->name."</strong> de <strong>".$feeding->Supply->name."</strong>.</p>";
        $this->addSowingNews($feeding->sowing_id, $description, "Alimento");
    }

    public function newMedicade ($feedingId) {
        $user = Auth::user();
        $Feeding = new SupplyUse();
        $feeding = $Feeding->Get($feedingId);

        $description = "<p><strong>".$user->name."</strong> ha medicado la cosecha con <strong>".$feeding->quantity.$feeding->Supply->MeasurementUnit->name."</strong> de <strong>".$feeding->Supply->name."</strong>.</p>";
        $this->addSowingNews($feeding->sowing_id, $description, "Medicamento");
    }

    public function newMortality ($mortalityId) {
        $user = Auth::user();
        $Mortality = new Mortality();
        $mortality = $Mortality->Get($mortalityId);

        $description = "<p><strong>".$user->name."</strong> ha hecho un nuevo registro de mortalidad con una muestra de <strong>".$mortality->sample_quantity."</strong> peces, donde <strong>".$mortality->dead."</strong> estaban muertos.</p>";
        $this->addSowingNews($mortality->Biomasse->Sowing->id, $description, "Mortalidad");
    }

    public function newBiomasse ($biomasseId) {
        $user = Auth::user();
        $biomasse = Biomasse::find($biomasseId);

        $description = "<p><strong>".$user->name."</strong> ha hecho un nuevo registro de biomasa con una muestra de <strong>".$biomasse->quantity_of_fish."</strong> peces, donde el peso approximado fue de <strong>".$biomasse->approximate_weight."</strong>gr.</p>";
        $this->addSowingNews($biomasse->sowing_id, $description, "Biomasa");
    }

    public function newStatAlarm($statReading) {
        $description = "<p>Se ha registrado una nueva alarma para el parámetro <strong>".$statReading->stepStat->name."</strong> con un valor minimo de <strong>".$statReading->stepStat->value_minimun."</strong> y un valor maximo de <strong>".$statReading->stepStat->value_maximun."</strong>, donde la lectura fue de <strong>".$statReading->value."</strong>.</p>";
        $this->addSowingNews($statReading->sowing_id, $description, "MQTT Alarma");
    }

    public function newStatsReadingsLost($data) {
        $description = "<p>Se ha detectado una perdida de datos en las lecturas continua, se ha enviado un email con la información. <br> Última lectura: <strong>".$data["topic_time"]."</strong></p>";
        $this->addSowingNews($data["sowing_id"], $description, "Pérdida de datos");
    }
}
