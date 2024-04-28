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

        $info['parties'] = $parties->getAllByRole($partyRoleId); 
        $info['partyRoles'] = PartyRole::all();
        $info['createPartyUrl'] = route('party.create', ['partyRoleId' => $partyRoleId]); 

        return $info;
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
}
