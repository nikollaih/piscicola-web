<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartyCreateRequest;
use App\Http\Requests\PartyUpdateRequest;
use App\Models\Party;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PartiesController extends Controller
{
    /**
     * Update the parti's profile information.
     */
    public function store(PartyCreateRequest $request)
    {
        $clientRequest = $request->all();
        $clientRequest["company_id"] = Auth::user()->company_id;
        Party::create($clientRequest);
    }

    /**
     * Update the parti's profile information.
     */
    public function update(PartyUpdateRequest $request, $partyId)
    {
        $clientRequest = $request->all();
        Party::where('id', $partyId)->update($clientRequest);
    }

    /**
     * Delete the client's account.
     */
    public function destroy($partyId)
    {
        // Get the logged user instance
        $user = Auth::user();
        // Get the client the user is trying to delete
        $client = Party::where('id', $partyId)
            ->where('company_id', $user->company_id)
            ->first();

        // If the user exists
        if($client){
            // Do the soft delete
            if($client->delete()){
                // Return a confirmation message
                return response()->json(["msg" => "Registro eliminado satisfactoriamente"], 200);
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return response()->json(["msg" => "No ha sido posible eliminar el registro"], 500);
            }
        }
        else {
            // If the user doesn't exist
            return response()->json(["msg" => "El registro no existe"], 404);
        }
    }
}
