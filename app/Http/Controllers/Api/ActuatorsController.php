<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\ActuatorsService;
use App\Http\Requests\ActuatorAutomationTimeCreateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Response;

class ActuatorsController extends BaseController
{

    public function __construct(private ActuatorsService $actuatorsService  ){}

    /**
     * returns all actuators
     */
    public function getAllActuators()
    {
        try {
            $actuators = $this->actuatorsService->getAllActuators();
            return $this->sendResponse($actuators, 'Actuadores obtenidos correctamente');
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }

    }
    /**
     * returns the required information to create a new actuator
     */
    public function getInfoToCreateActuator()
    {
        try {
            $infoToCreateActuator = $this->actuatorsService->getInfoToCreateActuator();
            return $this->sendResponse($infoToCreateActuator, 'Actuadores obtenidos correctamente');
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }

    }
    /**
     *  allows to store a new actuator
     */
    public function storeActuator(ActuatorAutomationTimeCreateRequest $request)
    {
        try {
            $infoToCreateActuator = $this->actuatorsService->storeActuator($request);
            return $this->sendResponse($infoToCreateActuator, 'Actuador creado correctamente');
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }

    }
    /**
     *  allows to get details of a actuator using it id
     */
    public function getActuatorDetails($actuatorId)
    {
        try {
            $actuatorDetails = $this->actuatorsService->getActuatorDetails($actuatorId);
            return $this->sendResponse($actuatorDetails, 'Detalles del actuador obtenidos correctamente');
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }

    }
    /**
     *  allows to update an actuator
     */
    public function updateActuator(ActuatorAutomationTimeCreateRequest $request, $actuatorId)
    {
        try {
            $this->actuatorsService->updateActuator($request,$actuatorId);
            return $this->sendResponse(true, 'Actuador actualizado correctamente');
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }

    }
    /**
     *  allows to destroy an actuator
     */
    public function destroyActuator($actuatorId)
    {
        try {
            $info = $this->actuatorsService->destroyActuator($actuatorId);
            if($info['status'])
                return $this->sendResponse(true, $info['msg']);
            return $this->sendError('Error.', $info['msg']);
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    }

}
