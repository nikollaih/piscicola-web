<?php

namespace App\Http\Controllers;


use App\Http\Requests\DeviceCreateRequest;
use App\Http\Requests\PondCreateRequest;
use App\Models\Device;
use App\Models\Pond;
use App\Models\Step;
use App\Models\StepStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Response;
use PhpMqtt\Client\Facades\MQTT;

class DevicesController extends Controller
{
    /**
     * Display mortalities listing
     */
    public function index(Request $request): Response
    {
        $Device = new Device();
        $devices = $Device->getAll();

        return \inertia('Devices/Index', [
            'devices' => $devices,
            'csrfToken' => csrf_token(),
            'createDeviceUrl' => route('device.create')
        ]);
    }

    public function view($deviceId): Response {
        $Device = new Device();
        $device = $Device->Get($deviceId);

        return \inertia('Devices/View', [
            'device' => $device,
            'csrfToken' => csrf_token()
        ]);
    }

    public function create (): Response {
        $Pond = new Pond();
        $ponds = $Pond->getAll();

        return \inertia('Devices/Create', [
            'ponds' => $ponds,
            'goBackRoute' => route('devices'),
            'formActionUrl' => route('device.store'),
            'devicesUrl' => route('devices')
        ]);
    }

    public function store (DeviceCreateRequest $request) {
        $user = Auth::user();
        $deviceRequest = $request->all();
        $deviceRequest['id_unidad_productiva'] = $user->productive_unit_id;
        $device = Device::create($deviceRequest);

        // Api response
        if($request->is('api/*')){
            if($device){
                return response()->json(Pond::find($device->id), 200);
            }
            return response()->json([], 500);
        }
    }

    /**
     * Display the user's profile form.
     */
    public function edit($deviceId): Response
    {
        $Pond = new Pond();
        $Device = new Device();
        $ponds = $Pond->getAll();
        $device = $Device->Get($deviceId);

        return \inertia('Devices/Create', [
            'device' => $device,
            'ponds' => $ponds,
            'goBackRoute' => route('devices'),
            'formActionUrl' => route('device.update', ['deviceId' => $deviceId]),
            'devicesUrl' => route('devices')
        ]);
    }


    /**
     * Update the device's profile information.
     */
    public function update(DeviceCreateRequest $request, $deviceId)
    {
        $deviceRequest = $request->all();
        Device::where('id', $deviceId)->update($deviceRequest);
    }

    /**
     * Delete the device row
     */
    public function destroy($deviceId)
    {
        // Get the device the user is trying to delete
        $device = Device::find($deviceId);

        // If the user exists
        if($device){
            // Do the soft delete
            if($device->delete()){
                // Return a confirmation message
                return redirect()->route('devices')->with('success', 'Registro eliminado satisfactoriamente');
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
