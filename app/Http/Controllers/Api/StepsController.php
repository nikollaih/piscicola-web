<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\StepsService;
use App\Http\Requests\StepCreateRequest;

class StepsController extends BaseController
{
    public function __construct(private StepsService $stepsService  ){}

    
    public function index()
    {
        try {
            $indexInfo = $this->stepsService->index();
            return $this->sendResponse($indexInfo, 'Datos del index obtenidos con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function store(StepCreateRequest $request)
    {
        try {
             $this->stepsService->store($request);
            return $this->sendResponse(true, 'Paso creado con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function update(StepCreateRequest $request, $stepId)
    {
        try {
            $this->stepsService->store($request,$stepId);
            return $this->sendResponse(true, 'Paso actualizado con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function destroy($stepId)
    {
        try {
            $deleteInfo = $this->stepsService->destroy($stepId);
            if($deleteInfo["status"])
                return $this->sendResponse(true, $deleteInfo["msg"]);
            return $this->sendError($deleteInfo["msg"]);
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
}
