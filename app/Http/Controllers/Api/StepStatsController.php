<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\StepStatsService;
use App\Http\Requests\StepStatCreateRequest;
class StepStatsController extends BaseController
{
    public function __construct(private StepStatsService $stepStatsService  ){}

    
    public function index($stepId = null)
    {
        try {
            $indexInfo = $this->stepStatsService->index($stepId);
            return $this->sendResponse($indexInfo, 'Datos del index obtenidos con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }

    public function create($stepId = null)
    {
        try {
            $indexInfo = $this->stepStatsService->create($stepId);
            return $this->sendResponse($indexInfo, 'Datos de los parametros obtenidos con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function store(StepStatCreateRequest $request)
    {
        try {
             $this->stepStatsService->store($request);
            return $this->sendResponse(true, 'Parametro creado con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function update(StepStatCreateRequest $request,$stepStatId)
    {
        try {
             $this->stepStatsService->update($request,$stepStatId);
            return $this->sendResponse(true, 'Parametro actualizado con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function destroy($stepStatId)
    {
        try {
             $resoult = $this->stepStatsService->destroy($stepStatId);
             if($resoult["status"])
                return $this->sendResponse(true, $resoult["msg"]);
            return $this->sendError($resoult["msg"]);
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
}
