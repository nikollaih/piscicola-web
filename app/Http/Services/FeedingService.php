<?php

namespace App\Http\Services;
use App\Models\Biomasse;
use App\Models\Sowing;
use App\Models\SupplyUse;
use App\Models\Supply;
use App\Helpers\SowingNews;
use App\Http\Requests\SupplyUseCreateRequest;
use App\Http\Requests\SupplyUseUpdateRequest;
use Illuminate\Http\Request;

class FeedingService {


    public function readings(Request $request, $sowingId, $biomasseIdOne = null, $biomasseIdTwo = null)
    {
        $readings = [];
        $Biomasse = new Biomasse();
        $Sowing = new Sowing();
        $SupplyUse = new SupplyUse();
        $Supply = new Supply();

        $Sowing->setSowingId($sowingId);
        $sowing = $Sowing->Get();

        $biomasseOne = $Biomasse->Get($biomasseIdOne);
        $biomasseTwo = $Biomasse->Get($biomasseIdTwo);
        $biomasses = $Biomasse->AllBySowing($sowingId);

        $supplies = $Supply->getAllByUse('ALIMENT');

        if($biomasseOne && $biomasseTwo) {
            for ($i = 0; $i < count($supplies); $i++) {
                $supply = $supplies[$i];
                $readings[$i]['step_stat'] = $supply;
                $readings[$i]['data_one'] = $SupplyUse->getBySupplyBiomasse($sowingId, $supply->id, $biomasseOne->id);
                $readings[$i]['data_two'] = $SupplyUse->getBySupplyBiomasse($sowingId, $supply->id, $biomasseTwo->id);
            }
        }

        return [
            'title' => 'alimentación',
            'sowing' => $sowing,
            'biomasseOne' => $biomasseOne,
            'biomasseTwo' => $biomasseTwo,
            'biomasses' => $biomasses,
            'readings' => $readings,
            'request' => $request,
 
        ];
    }
    public function index($sowingId = -1){
        $Sowing = new Sowing();
        $Feeding = new SupplyUse();
        $Supply = new Supply();

        $supplies = $Supply->getAllByUse("ALIMENT");
        $Sowing->setSowingId($sowingId);

        $sowing = $Sowing->Get();
        $feeding = $Feeding->getAll($sowingId, 'ALIMENT', true);
        $allFeeding["data"] = $Feeding->getAll($sowingId, 'ALIMENT');

        return [
            'title' => 'alimentación',
            'supplies' => $supplies,
            'sowing' => $sowing,
            'feeds' => $feeding,
            'readings' => $allFeeding,
        ];
    }

    public function infoToCreate($sowingId){
        $Biomasse = new Biomasse();
        $Supply = new Supply();

        $latestBiomasse = $Biomasse->Active($sowingId);
        $supplies = $Supply->getAllByUse("ALIMENT");

        return [
            'sowingId' => $sowingId,
            'biomasseId' => $latestBiomasse->id,
            'supplies' => $supplies,
        ];
    }
    public function store(SupplyUseCreateRequest $request)
    {
        $Supply = new Supply();
        $feedingRequest = $request->all();
        $feedingRequest["unit_cost"] = $Supply->getCost($feedingRequest["supply_id"]);
        $feeding = SupplyUse::create($feedingRequest);

        if ($feeding) {
            $Supply->Use($feedingRequest["supply_id"], $feedingRequest["quantity"]);
            $SowingNews = new SowingNews();
            $SowingNews->newFeeding($feeding->id);
        }
    }

    public function view($feedingId = -1){
        $Supply = new Supply();
        $feeding = SupplyUse::with('Supply.MeasurementUnit')->find($feedingId);
        $supplies = $Supply->getAllByUse("ALIMENT");
        return [
            'sowingId' => $feeding->sowing_id,
            'biomasseId' => $feeding->biomasse_id,
            'feed' => $feeding,
            'supplies' => $supplies,
        ];
    }
    public function update(SupplyUseUpdateRequest $request, $feedingId){
        $Supply = new Supply();
        $oldFeeding = SupplyUse::find($feedingId);
        $feedingRequest = $request->all();

        if (SupplyUse::where('id', $feedingId)->update($feedingRequest)) {
            $Supply->modifyUse($oldFeeding->supply_id, $oldFeeding->quantity, $feedingRequest["quantity"]);
        }
    }

    public function destroy($feedingId){
        $Supply = new Supply();

        // Get the biomasse the user is trying to delete
        $supplyUse = SupplyUse::find($feedingId);
        $sowing = Sowing::find($supplyUse->sowing_id);

        // If the user exists
        if($supplyUse){
            if($sowing->sale_date) return ["msg" => "No es posible eliminar el registro para una cosecha vendida", "status" => false];
            // Do the soft delete
            if($supplyUse->delete()){
                $Supply->modifyUse($supplyUse->supply_id, $supplyUse->quantity, 0);
                // Return a confirmation message
                return ["msg" => "Registro eliminado satisfactoriamente","status" => true];
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return ["msg" => "No ha sido posible eliminar el registro","status" => false];
            }
        }
        else {
            // If the user doesn't exist
            return ["msg" => "El registro no existe","status" => false];
        }
    }
}
