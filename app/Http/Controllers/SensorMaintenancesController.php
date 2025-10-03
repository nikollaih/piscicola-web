<?php

namespace App\Http\Controllers;

use App\Http\Requests\SensorMaintenanceCreateRequest;
use App\Http\Requests\SensorMaintenanceUpdateRequest;
use App\Models\Device;
use App\Models\SensorMaintenance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Response;

class SensorMaintenancesController extends Controller
{
    /**
     * INDEX: listado SIEMPRE por Device (anidado por ruta)
     * GET /devices/{deviceId}/sensor-maintenances
     */
    public function index(Request $request): Response
    {
        // Asegúrate de tener getAllForDevice() en el modelo SensorMaintenance
        $maintenances = (new SensorMaintenance())->getAll();

        return \inertia('SensorsMaintenance/Index', [
            'maintenances' => $maintenances,
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
     * CREATE: formulario (no anidado; el form envía device_id)
     *
     * Añadimos además la lista de devices para poblar un select en el form.
     */
    public function create(?int $deviceId = null): Response
    {
        $devices = (new Device())->getAll();

        return \inertia('SensorsMaintenance/Create', [
            'deviceId'        => $deviceId,
            'devices'         => $devices,
            'goBackRoute'     => route('sensorMaintenances'), // ajusta si tienes otra ruta
            'formActionUrl'   => route('sensorMaintenance.store'),
            'csrfToken'       => csrf_token(),
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

        // Redirigir al listado por device (mejor UX)
        return redirect()->route('sensorMaintenances')
            ->with('success', 'Mantenimiento registrado');
    }

    /**
     * EDIT
     */
    public function edit(int $sensorMaintenanceId): Response
    {
        $maintenance = (new SensorMaintenance())->getOne($sensorMaintenanceId);

        // Obtener devices para permitir reasignar device si hace falta
        $devices = (new Device())->getAll();

        return \inertia('SensorsMaintenance/Create', [
            'maintenance'   => $maintenance,
            'devices'       => $devices,
            'goBackRoute'   => route('sensorMaintenance.view', ['sensorMaintenanceId' => $sensorMaintenanceId]),
            'formActionUrl' => route('sensorMaintenance.update', ['sensorMaintenanceId' => $sensorMaintenanceId]),
            'csrfToken'     => csrf_token(),
        ]);
    }

    /**
     * UPDATE
     */
    public function update(int $sensorMaintenanceId, SensorMaintenanceUpdateRequest $request)
    {
        $maintenance = SensorMaintenance::findOrFail($sensorMaintenanceId);

        $data = $request->validated();

        if ($request->hasFile('evidence')) {
            $data['evidence_path'] = $request->file('evidence')
                ->store('sensor_maintenances', 'public');
        }

        $maintenance->fill($data);
        $maintenance->save();

        return redirect()->route('sensorMaintenances')
            ->with('success', 'Mantenimiento actualizado');
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
