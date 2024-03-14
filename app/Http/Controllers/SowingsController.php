<?php

namespace App\Http\Controllers;

use App\Helpers\EnvHelper;
use App\Http\Requests\SowingCreateRequest;
use App\Http\Requests\SowingUpdateRequest;
use App\Http\Requests\UserCreateRequest;
use App\Models\ActuatorUse;
use App\Models\Biomasse;
use App\Models\Expense;
use App\Models\Fish;
use App\Models\Pond;
use App\Models\Role;
use App\Models\Sowing;
use App\Models\SowingExpense;
use App\Models\StatsReading;
use App\Models\Step;
use App\Models\SupplyUse;
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
     * Display the sowings  form.
     */
    public function edit($sowingId): Response
    {
        $user = Auth::user();
        $Sowing = new Sowing();
        $Sowing->setSowingId($sowingId);

        $sowing = $Sowing->Get();
        $fish = Fish::all();
        $steps = Step::all();
        $ponds = Pond::where('productive_unit_id', $user->productive_unit_id)->get();

        return \inertia('Sowings/Create', [
            'sowing' => $sowing,
            'steps' => $steps,
            'fish' => $fish,
            'ponds' => $ponds,
            'formActionUrl' => route('sowing.update', ['sowingId' => $sowingId])
        ]);
    }

    /**
     * Update the supply's profile information.
     */
    public function update(SowingUpdateRequest $request, $sowingId)
    {
        $sowingRequest = $request->all();
        Sowing::where('id', $sowingId)->update($sowingRequest);
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

    /**
     * Delete the sowing row
     */
    public function destroy($sowingId)
    {
        // Get the biomasse the user is trying to delete
        $sowing = Sowing::find($sowingId);

        // If the user exists
        if($sowing){
            if($sowing->sale_date) return response()->json(["msg" => "No es posible eliminar una cosecha vendida"], 500);
            // Do the soft delete
            if($sowing->delete()){
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

    public function resume($sowingId): Response
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

        return \inertia('Sowings/Resume', [
            'sowing' => $sowing,
            'feedingCost' => $feedingCost,
            'medicineCost' => $medicineCost,
            'actuatorsCost' => $actuatorsCost,
            'expensesCost' => $expensesCost,
            'csrfToken' => csrf_token()
        ]);
    }
}
