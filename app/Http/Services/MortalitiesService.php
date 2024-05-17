<?php

namespace App\Http\Services;

use Illuminate\Http\Request;
use App\Models\Biomasse;
use App\Models\Sowing;
use App\Models\Mortality;
use App\Helpers\SowingNews;
use App\Http\Requests\MortalityCreateRequest;
use App\Http\Requests\MortalityUpdateRequest;
class MortalitiesService {


    public function readings($sowingId, $biomasseIdOne = null, $biomasseIdTwo = null)
    {
        $readings = [];
        $Biomasse = new Biomasse();
        $Sowing = new Sowing();
        $Mortality = new Mortality();

        $Sowing->setSowingId($sowingId);
        $sowing = $Sowing->Get();

        $biomasseOne = $Biomasse->Get($biomasseIdOne);
        $biomasseTwo = $Biomasse->Get($biomasseIdTwo);
        $biomasses = $Biomasse->AllBySowing($sowingId);

        $readings['step_stat']["name"] = "Mortalidad";
        $readings['data_one'] = $Mortality->GetByBiomasse($biomasseIdOne);
        $readings['data_two'] = $Mortality->GetByBiomasse($biomasseIdTwo);

        return [
            'sowing' => $sowing,
            'biomasseOne' => $biomasseOne,
            'biomasseTwo' => $biomasseTwo,
            'biomasses' => $biomasses,
            'readings' => $readings
        ];
    }

    public function index($sowingId = -1){
        $Sowing = new Sowing();
        $Sowing->setSowingId($sowingId);
        $Mortality = new Mortality();

        $sowing = $Sowing->Get();
        $mortalities = $Mortality->AllBySowing($sowingId);
        $latestMortalities = $Mortality->Latest($sowingId);

        return [
            'sowing' => $sowing,
            'mortalities' => $mortalities,
            'latestMortalities' => $latestMortalities,
        ];
    }

    public function getBiomasseId($sowingId = -1){
        $Biomasse = new Biomasse();
        $activeBiomasse = $Biomasse->Active($sowingId);
        return [
            'biomasseId' => $activeBiomasse->id
        ];
    }

    public function store(MortalityCreateRequest $request, $sowingId){
        $Biomasse = new Biomasse();
        $sowing = Sowing::find($sowingId);
        $activeBiomasse = $Biomasse->Active($sowingId);

        $mortailityRequest = $request->all();
        $mortailityRequest["biomasse_id"] = $activeBiomasse->id;
        $mortality = Mortality::create($mortailityRequest);

        if($mortality) {
            $deadQuantity = doubleval($sowing->dead_quantity) + doubleval($mortailityRequest["dead"]);
            Sowing::where('id', $sowingId)->update(['dead_quantity' => $deadQuantity]);
            $SowingNews = new SowingNews();
            $SowingNews->newMortality($mortality->id);
        }
        $Mortality = Mortality::class;

        return $Mortality::findOrFail($mortality->id);

    }

    public function getMortalityInfo($mortalityId = -1){
        $Mortality = new Mortality();
        $mortality = $Mortality->Get($mortalityId);
        return [
            'biomasseId' => $mortality->biomasse_id,
            'mortality' => $mortality
        ];
    }

    public function update(MortalityUpdateRequest $request, $mortalityId){
        $mortalityRequest = $request->all();
        Mortality::where('id', $mortalityId)->update($mortalityRequest);
    }

    public function destroy($mortalityId){
        // Get the mortality the user is trying to delete
        $mortality = Mortality::with('Biomasse')->find($mortalityId);
        $sowing = Sowing::findOrFail($mortality->biomasse->sowing_id);

        // If the user exists
        if($mortality){
            if($sowing->sale_date) return ["msg" => "No es posible eliminar el registro para una cosecha vendida","status" => false];
            // Do the soft delete
            if($mortality->delete()){
                // Return a confirmation message
                return ["msg" => "Registro eliminado satisfactoriamente", "status" => true];
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return ["msg" => "No ha sido posible eliminar el registro","status" => false];
            }
        }
        else {
            // If the user doesn't exist
            return ["msg" => "El registro no existe", "status" => false];
        }
    }
}