<?php

namespace App\Http\Controllers;

use App\Http\Requests\SensorMaintenanceCreateRequest;
use App\Http\Requests\SensorMaintenanceUpdateRequest;
use App\Models\Pond;
use App\Models\SensorMaintenance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Response;

class SensorMaintenancesController extends Controller
{
    /**
     * INDEX: listado SIEMPRE por Pond (anidado por ruta)
     * GET /ponds/{pondId}/sensor-maintenances
     */
    public function index(Request $request, int $pondId): Response
    {
        $maintenances = (new SensorMaintenance())->getAllForPond($pondId);

        return \inertia('SensorsMaintenance/Index', [
            'maintenances' => $maintenances,
            'pondId'       => $pondId,
            'csrfToken'    => csrf_token(),
        ]);
    }

    /**
     * VIEW: ver un mantenimiento (ruta no anidada para dejar tu flujo igual)
     */
    public function view(int $sensorMaintenanceId): Response
    {
        $maintenance = (new SensorMaintenance())->getOne($sensorMaintenanceId);

        return \inertia('SensorsMaintenance/View', [
            'maintenance' => $maintenance,
            'csrfToken'   => csrf_token(),
        ]);
    }

    /**
     * CREATE: formulario (no anidado; el form envía pond_id)
     */
    public function create($pondId): Response
    {
        return \inertia('SensorsMaintenance/Create', [
            'pondId'          => $pondId,
            'goBackRoute'    => route('sensorMaintenances'),
            'formActionUrl'  => route('sensorMaintenance.store'),
        ]);
    }

    /**
     * STORE
     */
    public function store(SensorMaintenanceCreateRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('evidence')) {
            $data['evidence_path'] = $request->file('evidence')
                ->store('sensor_maintenances', 'public');
        }

        $maintenance = SensorMaintenance::create($data);

        return Redirect::route('pond.sensorMaintenances', ['pondId' => $maintenance->pond->id])
            ->with('success', 'Mantenimiento registrado');
    }

    /**
     * EDIT
     */
    public function edit(int $sensorMaintenanceId): Response
    {
        $maintenance = (new SensorMaintenance())->getOne($sensorMaintenanceId);
        $ponds = (new Pond())->getAll();

        return \inertia('SensorsMaintenance/Create', [
            'maintenance'   => $maintenance,
            'ponds'         => $ponds,
            'goBackRoute'   => route('sensorMaintenance.view', ['sensorMaintenanceId' => $sensorMaintenanceId]),
            'formActionUrl' => route('sensorMaintenance.update', ['sensorMaintenanceId' => $sensorMaintenanceId]),
        ]);
    }

    /**
     * UPDATE
     */
    public function update(SensorMaintenanceUpdateRequest $request, int $sensorMaintenanceId)
    {
        dd($request);
        $maintenance = SensorMaintenance::findOrFail($sensorMaintenanceId);
        $data = $request->validated();

        dd($data);

        if ($request->hasFile('evidence')) {
            $data['evidence_path'] = $request->file('evidence')
                ->store('sensor_maintenances', 'public');
        }

        $maintenance->update($data);

        return Redirect::route('pond.sensorMaintenances', ['pondId' => $maintenance->pond->id])
            ->with('success', 'Mantenimiento registrado');
    }

    /**
     * DELETE (soft delete)
     */
    public function destroy(int $sensorMaintenanceId)
    {
        $maintenance = SensorMaintenance::find($sensorMaintenanceId);

        if (!$maintenance) {
            return response()->json(['msg' => 'El registro no existe'], 404);
        }

        if ($maintenance->delete()) {
            return response()->json(['msg' => 'Registro eliminado satisfactoriamente'], 200);
        }

        return response()->json(['msg' => 'No ha sido posible eliminar el registro'], 500);
    }

    /**
     * (Opcional) listado general si aún lo usas en alguna parte del front.
     * Puedes quitarlo si ya no lo necesitas.
     */
    public function legacyIndex(): Response
    {
        return \inertia('SensorsMaintenance/Index', [
            'maintenances' => [],
            'csrfToken'    => csrf_token(),
        ]);
    }
}
