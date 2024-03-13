<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartyCreateRequest;
use App\Http\Requests\PartyUpdateRequest;
use App\Models\Party;
use App\Models\PartyRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PartiesController extends Controller
{
    public function index ($partyRoleId) {
        $partyRoles = PartyRole::all();
        $Parties = new Party();
        $parties = $Parties->getAllByRole($partyRoleId);

        return \inertia('Parties/Index', [
            'parties' => $parties,
            'partyRoles' => $partyRoles,
            'partyRoleId' => $partyRoleId,
            'createPartyUrl' => route('party.create', ['partyRoleId' => $partyRoleId]),
            'csrfToken' => csrf_token()
        ]);
    }

    public function create($partyRoleId) {
        $partyRoles = PartyRole::all();

        return \inertia('Parties/Create', [
            'partyRoles' => $partyRoles,
            'partyRoleId' => $partyRoleId,
            'formActionUrl' => route('party.store', ['partyRoleId' => $partyRoleId]),
            'csrfToken' => csrf_token()
        ]);
    }

    /**
     * Update the parti's profile information.
     */
    public function store(PartyCreateRequest $request)
    {
        $user = Auth::user();
        $partyRequest = $request->all();
        $partyRequest["productive_unit_id"] = $user->productive_unit_id;
        Party::create($partyRequest);
    }

    public function edit($partyId) {
        $party = Party::find($partyId);
        $partyRoles = PartyRole::all();

        return \inertia('Parties/Create', [
            'partyRoles' => $partyRoles,
            'partyRoleId' => $party->party_role_id,
            'party' => $party,
            'formActionUrl' => route('party.update', ['partyId' => $partyId]),
            'csrfToken' => csrf_token()
        ]);
    }

    /**
     * Update the parti's profile information.
     */
    public function update(PartyCreateRequest $request, $partyId)
    {
        $partyRequest = $request->all();
        Party::where('id', $partyId)->update($partyRequest);
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
