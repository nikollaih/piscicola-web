<?php

namespace App\Http\Controllers;

use App\Helpers\EnvHelper;
use App\Http\Requests\PartyCreateRequest;
use App\Http\Requests\PartyUpdateRequest;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Party;
use App\Models\State;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ClientsController extends PartiesController
{
    /**
     * Display clients listing
     */
    public function index(Request $request): Response
    {
        $searchValue = $request->input('search');
        $url = $request->url();
        $user = Auth::user();

        if($request->has('search')){
            $clients = Party::where('company_id', $user->company_id)
                ->where('is_client', 1)
                ->where('deleted_at', null)
                ->where('document', 'LIKE', "%{$searchValue}%")
                ->orWhere('name', 'LIKE', "%{$searchValue}%")
                ->orderBy('name', 'asc')
                ->paginate(10);
        }
        else {
            $clients = Party::where('company_id', $user->company_id)
                ->where('is_client', 1)
                ->where('deleted_at', null)
                ->orderBy('name', 'asc')
                ->paginate(10);
        }

        return \inertia('Parties/Index', [
            'clients' => $clients,
            'request' => $request,
            'url' => $url,
            'baseUrl' => url('/'),
            'createClientUrl' => url('/clients/create'),
            'csrfToken' => csrf_token()
        ]);
    }

    /**
     * Display the create new client form
     * @return Response
     */
    public function create(): Response
    {
        $states = State::orderBy('name', 'asc')->get();
        return \inertia('Parties/Create', [
            'role_id' => 7,
            'states' => $states,
            'partiesUrl' => route('clients'),
            'formActionUrl' => route('client.store'),
        ]);
    }

    /**
     * Display the user's profile form.
     */
    public function edit($clientId): Response
    {
        $party = Party::with('city.state')->find($clientId);
        $states = State::orderBy('name', 'asc')->get();

        return \inertia('Parties/Create', [
            'party' => $party,
            'states' => $states,
            'partiesUrl' => route('clients'),
            'formActionUrl' => route('client.update', ['partyId' => $clientId]),
        ]);
    }

    /**
     * Display the user's profile information.
     */
    public function view($clientId)
    {
        $loggedUser = User::with('role')->find(Auth::id());
        $client = Party::with('city.state')->find($clientId);
        $states = State::orderBy('name', 'asc')->get();
        $envRoles = EnvHelper::getRoles();

        if($client){
            return \inertia('Parties/View', [
                'loggedUser' => $loggedUser,
                'client' => $client,
                'states' => $states,
                'envRoles' => $envRoles,
                'csrfToken' => csrf_token()
            ]);
        }
        else {
            return Redirect::route('clients');
        }
    }
}
