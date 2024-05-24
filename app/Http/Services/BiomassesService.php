<?php

namespace App\Http\Services;

use App\Models\Biomasse;
use App\Models\Sowing;
use App\Models\StatsReading;
use App\Helpers\SowingNews;
use App\Http\Requests\CreateBiomasseRequest;
use App\Http\Controllers\Api\BaseController as BaseController;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Validator;

class BiomassesService {

    //permite obtener todas las biomasas de una siembra
    public function getAllBySowing($sowingId = -1){
        return  Biomasse::where('sowing_id', $sowingId)->get();
    }

    //obtiene la informacion necesaria para la vista de index
    public function getIndexInfo($sowingId = -1){
         $Sowing = new Sowing();
        $Sowing->setSowingId($sowingId);
        $Biomasse = new Biomasse();

        $sowing = $Sowing->Get();
        $biomasses = $Biomasse->AllBySowing($sowingId);
        $latestBiomasses = $Biomasse->Latest($sowingId, 50);
        return ['sowing' => $sowing,'biomasses' => $biomasses,'latestBiomasses' => $latestBiomasses,];
        }
    public function getBiomasseReadings($sowingId=-1, $biomasseIdOne = null, $biomasseIdTwo = null){
        $readings = [];
        $Biomasse = new Biomasse();
        $Sowing = new Sowing();
        $StatsReading = new StatsReading();

        $Sowing->setSowingId($sowingId);
        $sowing = $Sowing->Get();

        $biomasseOne = $Biomasse->Get($biomasseIdOne);
        $biomasseTwo = $Biomasse->Get($biomasseIdTwo);
        $biomasses = $Biomasse->AllBySowing($sowingId);

        $latestReadings = $StatsReading->latest($sowingId);

        for ($i = 0; $i < count($latestReadings); $i++) {
            $latestReading = $latestReadings[$i];
            $latestReading->StepStat["step"] = $latestReading->Step;
            $readings[$i]['step_stat'] = $latestReading->StepStat;
            $readings[$i]['data_one'] = $StatsReading->GetByBiomasseType($biomasseIdOne, $latestReading->StepStat->id);
            $readings[$i]['data_two'] = $StatsReading->GetByBiomasseType($biomasseIdTwo, $latestReading->StepStat->id);
        }
        return ['sowing' => $sowing,'biomasseOne' => $biomasseOne,'biomasseTwo' => $biomasseTwo,'biomasses' => $biomasses,
                'readings' => $readings];
    }

    //create a new biomasse
    public function storeBiomasse(CreateBiomasseRequest $request){
        $biomasseRequest = $request->all();
        $sowing = Sowing::find($biomasseRequest["sowing_id"]);
        $biomasseRequest["step_id"] = $sowing->step_id;
        $biomasse = Biomasse::create($biomasseRequest);
        if($biomasse){
            $SowingNews = new SowingNews();
            $SowingNews->newBiomasse($biomasse->id);
        }
    }
    //get biomasse info
    public function getBiomasseInfo($biomasseId = -1){
        $Biomasse = new Biomasse();
        $biomasse = $Biomasse->Get($biomasseId);
        $sowingId = $biomasse->sowing_id;
        return ['sowingId' => $sowingId,'biomasse' => $biomasse];
    }

    public function updateBiomasse(CreateBiomasseRequest $request, $biomasseId){
       $userRequest = $request->all();
       Biomasse::where('id', $biomasseId)->update($userRequest);
    }

    public function destroyBiomasse($biomasseId = -1){
        // Get the biomasse the user is trying to delete
        $biomasse = Biomasse::find($biomasseId);
        // If the user exists
        if($biomasse){
            $sowing = Sowing::find($biomasse->sowing_id);
            if($sowing->sale_date) return ["msg" => "No es posible eliminar el registro para una cosecha vendida", "status" => false];
            // Do the soft delete
            if($biomasse->delete()){
                // Return a confirmation message
                return ["msg" => "Registro eliminado satisfactoriamente","status" => true];
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return ["msg" => "No ha sido posible eliminar el registro", "status" => false];
            }
        }
        else {
            // If the user doesn't exist
            return ["msg" => "El registro no existe","status" => false];
        }
    }
}
