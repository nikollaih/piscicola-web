<?php

namespace App\Helpers;

use App\Models\SowingNew;
use App\Models\SupplyUse;
use Illuminate\Support\Facades\Auth;

class SowingNews
{
    public function addSowingNews ($sowingId, $description, $title) {
        $user = Auth::user();
        $sowingNews["sowing_id"] = $sowingId;
        $sowingNews["user_id"] = $user->id;
        $sowingNews["title"] = $title;
        $sowingNews["description"] = $description;

        return SowingNew::create($sowingNews);
    }

    public function newFeeding ($feedingId) {
        $user = Auth::user();
        $Feeding = new SupplyUse();
        $feeding = $Feeding->Get($feedingId);


        $description = "<p><strong>".$user->name."</strong> ha alimentado la cosecha con <strong>".$feeding->quantity.$feeding->Supply->MeasurementUnit->name."</strong> de <strong>".$feeding->Supply->name."</strong></p>";
        $this->addSowingNews($feeding->sowing_id, $description, "Alimento");
    }

    public function newMedicade ($feedingId) {
        $user = Auth::user();
        $Feeding = new SupplyUse();
        $feeding = $Feeding->Get($feedingId);


        $description = "<p><strong>".$user->name."</strong> ha medicado la cosecha con <strong>".$feeding->quantity.$feeding->Supply->MeasurementUnit->name."</strong> de <strong>".$feeding->Supply->name."</strong></p>";
        $this->addSowingNews($feeding->sowing_id, $description, "Medicamento");
    }
}
