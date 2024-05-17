<?php

namespace App\Http\Services;

use App\Models\Pond;
use App\Http\Requests\PondCreateRequest;
use App\Http\Controllers\Api\BaseController as BaseController;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Verified;
use Validator;

class PondsService {

    public function getAllPonds()
    {
        $Pond = new Pond();
        $ponds = $Pond->getAll();
        return $ponds;
    }
    public function storePond(PondCreateRequest $request){
        $user = Auth::user();
        $pondRequest = $request->all();
        $pondRequest["productive_unit_id"] = $user->productive_unit_id;

        $pond = Pond::create($pondRequest);
        return ['success' => true, 'pond' => $pond];
    }

    public function updatePond(PondCreateRequest $request,$pondId){
        $pondRequest = $request->all();
        Pond::where('id', $pondId)->update($pondRequest);
    }

    public function getPond($pondId = -1){
        $user = Auth::user();
        return Pond::where('id',$pondId)->where('productive_unit_id',$user->productive_unit_id)->first();
    }
    
    public function destroyPond($pondId){
        $Pond = new Pond();
        // Get the mortality the user is trying to delete
        $pond = Pond::find($pondId);

        // If the user exists
        if($pond){
            if(!$Pond->isUsed($pondId)){
                // Do the soft delete
                if($pond->delete()){
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
                return ["msg" => "El estanque está siendo utilizado por una cosecha, no puede ser eliminado", "status" => false];
            }
        }
        else {
            // If the user doesn't exist
            return ["msg" => "El registro no existe", "status" => false];
        }
    }



}