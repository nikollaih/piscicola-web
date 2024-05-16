<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\MqttService;

class MqttController extends BaseController
{
    public function __construct(private MqttService $mqttService  ){}
    
    public function setTurnActuator($topic, $message)
    {
        try {
            $this->mqttService->setTurnActuator($topic,$message);
            return $this->sendResponse(true, 'Operación realizada con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    
}
