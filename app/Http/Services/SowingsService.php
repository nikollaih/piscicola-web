<?php

namespace App\Http\Services;

use App\Models\Sowing;
use App\Models\SupplyUse;
use App\Models\ActuatorUse;
use App\Models\Expense;
use App\Models\StatsReading;
use App\Models\Biomasse;
use App\Models\Fish;
use App\Models\Step;
use App\Models\Pond;
use App\Helpers\EnvHelper;
use App\Http\Requests\SowingCreateRequest;
use App\Http\Requests\SowingUpdateRequest;
use App\Http\Controllers\Api\BaseController as BaseController;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Verified;
use Validator;

class SowingsService {

    public function getSowingsList()
    {
        $Sowing = new Sowing();
        return $Sowing->GetAll();
    }
    public function getSowingResume($sowingId =-1 )
    {
        $Sowing = new Sowing();
        $SupplyUse = new SupplyUse();
        $ActuatorUse = new ActuatorUse();
        $Expense = new Expense();
        $Sowing->setSowingId($sowingId);
        $sowing = $Sowing->get();

        $feedingCost = $SupplyUse->getSowingCost($sowingId, 'ALIMENT');
        $medicineCost = $SupplyUse->getSowingCost($sowingId, 'MEDICINE');
        $actuatorsCost = $ActuatorUse->getSowingCost($sowingId);
        $expensesCost = $Expense->getSowingCost($sowingId);
        return ['sowing' => $sowing, 'feedingCost' => $feedingCost, 'medicineCost' => $medicineCost, 'actuatorsCost'=>$actuatorsCost,
                'expensesCost'=>$expensesCost];
    }
    //metodo 
    public function getSowingBasicInfo($sowingId = -1){
        return Sowing::getBasicInfoById($sowingId);
    }
    public function getSowingBasicInfoBySessionUser($sowingId = -1){
        return Sowing::getBasicInfoByIdAndProductiveUnit($sowingId,Auth::user()->productive_unit_id);
        //return Sowing::where("id",$sowingId)->where("productive_unit_id",Auth::user()->productive_unit_id)->first();
    }
    public function getSowingView($sowingId =-1 )
    {

        $Stat = new StatsReading();
        $Biomasse = new Biomasse();
        $Sowing = new Sowing();
        $Sowing->setSowingId($sowingId);

        $sowing = $Sowing->Get();
        $biomasses = $Biomasse->AllBySowing($sowingId);

        if($sowing == null)
            return [];

        $stats = $Stat->latest($sowing->id, $sowing->step_id);

        return ['sowing' => $sowing, 'biomasses' => $biomasses, 'statsReadings' => $stats];
    }
    public function getCreateInfo()
    {

        $user = Auth::user();
        $fish = Fish::all();
        $steps = Step::all();
        $ponds = Pond::where('productive_unit_id', $user->productive_unit_id)->get();

        return ['steps' => $steps, 'fish' => $fish, 'ponds' => $ponds];
    }
    /**
     * Create a new sowing.
     */
    public function storeSowing(SowingCreateRequest $request){
        $Biomasse = new Biomasse();
        $sowingRequest = $request->all();
        $sowingRequest["productive_unit_id"] = Auth::user()->productive_unit_id;
        $newSowing = Sowing::create($sowingRequest);
        $Biomasse->AddFirst($newSowing);
    }

    public function updateSowing(SowingUpdateRequest $request, $sowingId){
        Sowing::where('id', $sowingId)->update($request->all());
    }

    public function destroySowing($sowingId){

        // Get the biomasse the user is trying to delete
        $sowing = Sowing::find($sowingId);

        // If the user exists
        if($sowing){
            if($sowing->sale_date) return response()->json(["msg" => "No es posible eliminar una cosecha vendida"], 500);
            // Do the soft delete
            if($sowing->delete()){
                // Return a confirmation message
                return ['msg'=>"Registro eliminado satisfactoriamente","status"=>true];
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return ['msg'=>"No ha sido posible eliminar el registro","status"=>false];
            }
        }
        else {
            // If the user doesn't exist
            return ['msg'=>"El registro no existe","status"=>false];
        }
    }

}
