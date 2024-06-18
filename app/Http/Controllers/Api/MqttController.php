<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\MqttService;
use App\Http\Requests\SetTurnActuatorRequest;

class MqttController extends BaseController
{
    public function __construct(private MqttService $mqttService  ){}
    

    // Change the actuator status to turned on/off
    public function setTurnActuator(SetTurnActuatorRequest $request)
    {
        try {
            $info = $this->mqttService->setTurnActuator($request);
            if($info['success'])
                return $this->sendResponse(null, $info['msg']);
            return $this->sendError($info['msg']);
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    
}
