<?php

namespace App\Http\Controllers;

use App\Helpers\EnvHelper;
use App\Http\Requests\SowingCreateRequest;
use App\Http\Requests\UserCreateRequest;
use App\Models\Biomasse;
use App\Models\Fish;
use App\Models\Pond;
use App\Models\Role;
use App\Models\Sowing;
use App\Models\StatsReading;
use App\Models\Step;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Response;

class SowingsController extends Controller
{
    /**
     * Display sowings listing
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $Sowing = new Sowing();
        $sowings = $Sowing->GetAll();

        return \inertia('Sowings/Index', [
            'user' => $user,
            'sowings' => $sowings,
            'request' => $request,
            'baseUrl' => url('/'),
            'createSowingUrl' => route('sowing.create'),
            'csrfToken' => csrf_token()
        ]);
    }

    public function create(): Response
    {
        $user = Auth::user();
        $fish = Fish::all();
        $steps = Step::all();
        $ponds = Pond::where('productive_unit_id', $user->productive_unit_id)->get();

        return \inertia('Sowings/Create', [
            'steps' => $steps,
            'fish' => $fish,
            'ponds' => $ponds,
            'usersUrl' => url('/users'),
            'formActionUrl' => route('sowing.store')
        ]);
    }

    /**
     * Create a new sowing.
     */
    public function store(SowingCreateRequest $request)
    {
        $Biomasse = new Biomasse();
        $sowingRequest = $request->all();
        $sowingRequest["productive_unit_id"] = Auth::user()->productive_unit_id;
        $newSowing = Sowing::create($sowingRequest);
        $Biomasse->AddFirst($newSowing->id);
    }

    /**
     * Display the user's profile information.
     */
    public function view($sowingId)
    {
        $Stat = new StatsReading();
        $Biomasse = new Biomasse();
        $Sowing = new Sowing();
        $Sowing->setSowingId($sowingId);

        $sowing = $Sowing->Get();
        $biomasses = $Biomasse->AllBySowing($sowingId);
        $stats = $Stat->latest($sowingId);

        if(!empty($sowing)){
            return \inertia('Sowings/View', [
                'biomasses' => $biomasses,
                'statsReadings' => $stats,
                'sowing' => $sowing,
                'baseUrl' => url('/'),
                'csrfToken' => csrf_token()
            ]);
        }
        else {
            return Redirect::route('sowings');
        }
    }
}
