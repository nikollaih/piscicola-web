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
        $client = Party::find($partyId);

        if (!$client) {
            return redirect()->back()->withErrors(['msg' => 'El registro no existe.']);
        }

        if ($client->delete()) {
            return redirect()
                ->route('parties', ['partyRoleId' => $client->party_role_id])
                ->with('success', 'Registro eliminado satisfactoriamente.');
        }

        return redirect()->back()->withErrors(['msg' => 'No ha sido posible eliminar el registro.']);
    }


}
