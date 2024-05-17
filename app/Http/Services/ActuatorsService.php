<?php

namespace App\Http\Services;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Models\Actuator;
use App\Models\ActuatorType;
use App\Models\ActuatorUse;
use App\Models\Pond;
use App\Http\Requests\ActuatorCreateRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Verified;
use Validator;

class ActuatorsService {

    public function getAllActuators()
    {
        $Actuator = new Actuator();
        return $Actuator->getAll();
    }

    //permite obtener la informacion necesaria para crear un nuevo actuador
    public function getInfoToCreateActuator()
    {
        $Pond = new Pond();
        $ponds = $Pond->getAll();
        $actuatorTypes = ActuatorType::all();

        return ['ponds' => $ponds,'actuatorTypes'=>$actuatorTypes];
    }

    public function storeActuator(ActuatorCreateRequest $request){
        $actuatorRequest = $request->all();
        $actuator = Actuator::create($actuatorRequest);
        return $actuator;
    }

    public function getActuatorDetails($actuatorId = -1){

        $Actuator = new Actuator();
        $ActuatorUse = new ActuatorUse();
        $actuator = $Actuator->Get($actuatorId);
        $actuatorUses = $ActuatorUse->getAll($actuatorId);
        $readings = $ActuatorUse->getAll($actuatorId, false);
        return ['actuator' => $actuator,'actuatorUses' => $actuatorUses, 'readings' => $readings];
    }

    //allows update an actuator by it id
    public function updateActuator(ActuatorCreateRequest $request,$actuatorId){
        $actuatorRequest = $request->all();
        Actuator::where('id', $actuatorId)->update($actuatorRequest);
    }
    public function destroyActuator($actuatorId = -1){
        // Get the actuator the user is trying to delete
        $actuator = Actuator::find($actuatorId);

        // If the user exists
        if($actuator){
            // Do the soft delete
            if($actuator->delete()){
                // Return a confirmation message
                return ["msg" => "Registro eliminado satisfactoriamente", "status" => true];
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return ["msg" => "No ha sido posible eliminar el registro", "status" => false];
            }
        }
        else {
            // If the user doesn't exist
            return ["msg" => "El registro no existe", "status" => false];
        }

    }

}