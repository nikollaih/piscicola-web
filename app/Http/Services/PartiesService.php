<?php

namespace App\Http\Services;

use App\Models\Party;
use App\Models\PartyRole;
use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Requests\PartyCreateRequest;
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

class PartiesService {

    public function getPartiesByRoleId($partyRoleId = -1){

        $parties = new Party();

        return $parties->getAllByRole($partyRoleId);
    }

    public function  getPartieInfoById($partyId = -1){

        $partie = Party::where('id',$partyId)->whereNull('deleted_at')->first();
        if($partie){
            //loads the party Role and productiveUnit
            $partie->partyRole;
            $partie->productiveUnit;

            return  $partie;
        }else{
            return null;
        }
    }
    public function  storeParty(PartyCreateRequest $request){

        $user = Auth::user();
        $partyRequest = $request->all();
        $partyRequest["productive_unit_id"] = $user->productive_unit_id;
        Party::create($partyRequest);

    }

    public function updateParty(PartyCreateRequest $request, $partyId = -1){

        $partyRequest = $request->all();
        Party::where('id', $partyId)->update($partyRequest);
    }
    public function deleteParty($partyId = -1){
        // Get the logged user instance
        $user = Auth::user();
        // Get the client the user is trying to delete
        $client = Party::where('id', $partyId)
            ->where('productive_unit_id', $user->productive_unit_id)
            ->first();

        // If the user exists
        if($client){
            // Do the soft delete
            if($client->delete()){
                // Return a confirmation message
                return ["msg" => "Registro eliminado satisfactoriamente", "success" => true];
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return ["msg" => "No ha sido posible eliminar el registro", "success" => false];
            }
        }
        else {
            // If the user doesn't exist
            return ["msg" => "El registro no existe", "success" => false];
        }
    }
}
