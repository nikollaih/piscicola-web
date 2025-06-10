<?php

namespace App\Http\Controllers;

use App\Http\Requests\SowingCreateRequest;
use App\Http\Requests\SowingUpdateRequest;
use App\Models\ActuatorUse;
use App\Models\Biomasse;
use App\Models\Expense;
use App\Models\Fish;
use App\Models\Pond;
use App\Models\Sowing;
use App\Models\StatsReading;
use App\Models\Step;
use App\Models\SupplyUse;
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

        return inertia('Sowings/Index', [
            'user' => $user,
            'sowings' => $sowings,
            'request' => $request,
            'baseUrl' => url('/'),
            'createSowingUrl' => route('sowing.create'),
            'csrfToken' => csrf_token()
        ]);
    }

    /**
     * Show the form for creating a new sowing.
     */
    public function create(): Response
    {
        $user = Auth::user();
        $fish = Fish::all();
        $steps = Step::all();
        $ponds = Pond::where('productive_unit_id', $user->productive_unit_id)->get();

        return inertia('Sowings/Create', [
            'steps' => $steps,
            'fish' => $fish,
            'ponds' => $ponds,
            'usersUrl' => url('/users'),
            'formActionUrl' => route('sowing.store')
        ]);
    }

    /**
     * Store a newly created sowing in storage.
     */
    public function store(SowingCreateRequest $request)
    {
        $sowingRequest = $request->all();
        $sowingRequest["productive_unit_id"] = Auth::user()->productive_unit_id;

        // Crear la siembra con la fecha_estimada incluida
        $newSowing = Sowing::create($sowingRequest);

        // Agregar la biomasa inicial
        $Biomasse = new Biomasse();
        $Biomasse->AddFirst($newSowing);

        return redirect()->route('sowing.index')->with('success', 'Siembra creada exitosamente.');
    }

    /**
     * Show the form for editing the specified sowing.
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

        return inertia('Sowings/Create', [
            'sowing' => $sowing,
            'steps' => $steps,
            'fish' => $fish,
            'ponds' => $ponds,
            'formActionUrl' => route('sowings.update', ['sowingId' => $sowingId])
        ]);
    }

    /**
     * Update the specified sowing in storage.
     */
    public function update(SowingUpdateRequest $request, $sowingId)
    {
        $sowingRequest = $request->all();

        // Actualizar la siembra con la fecha_estimada incluida
        Sowing::where('id', $sowingId)->update($sowingRequest);

        return redirect()->route('sowings.index')->with('success', 'Siembra actualizada exitosamente.');
    }

    /**
     * Display the specified sowing details.
     */
    public function view($sowingId)
    {
        $Stat = new StatsReading();
        $Biomasse = new Biomasse();
        $Sowing = new Sowing();
        $Sowing->setSowingId($sowingId);

        $sowing = $Sowing->Get();
        $biomasses = $Biomasse->AllBySowing($sowingId);
        $stats = $Stat->latest($sowing->id, $sowing->step_id);

        if (!empty($sowing)) {
            return inertia('Sowings/View', [
                'biomasses' => $biomasses,
                'statsReadings' => $stats,
                'sowing' => $sowing,
                'baseUrl' => url('/'),
                'csrfToken' => csrf_token()
            ]);
        } else {
            return Redirect::route('sowings');
        }
    }

    /**
     * Remove the specified sowing from storage.
     */
    public function destroy($sowingId)
    {
        $sowing = Sowing::find($sowingId);

        if ($sowing) {
            if ($sowing->sale_date) {
                return response()->json(["msg" => "No es posible eliminar una cosecha vendida"], 500);
            }

            if ($sowing->delete()) {
                return response()->json(["msg" => "Registro eliminado satisfactoriamente"], 200);
            } else {
                return response()->json(["msg" => "No ha sido posible eliminar el registro"], 500);
            }
        } else {
            return response()->json(["msg" => "El registro no existe"], 404);
        }
    }

    /**
     * Display sowing summary.
     */
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

        return inertia('Sowings/Resume', [
            'sowing' => $sowing,
            'feedingCost' => $feedingCost,
            'medicineCost' => $medicineCost,
            'actuatorsCost' => $actuatorsCost,
            'expensesCost' => $expensesCost,
            'csrfToken' => csrf_token()
        ]);
    }
}
