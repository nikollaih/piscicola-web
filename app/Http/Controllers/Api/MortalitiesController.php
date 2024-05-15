<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\MortalitiesService;
use App\Http\Requests\MortalityCreateRequest;
use App\Http\Requests\MortalityUpdateRequest;

class MortalitiesController extends BaseController
{
    public function __construct(private MortalitiesService $mortalitiesService  ){}



    public function readings($sowingId, $biomasseIdOne = null, $biomasseIdTwo = null)
    {
        try {
            $readings = $this->mortalitiesService->readings($sowingId,$biomasseIdOne,$biomasseIdTwo);
            return $this->sendResponse($readings, 'Lecturas obtenidas con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function index($sowingId)
    {
        try {
            $readings = $this->mortalitiesService->index($sowingId);
            return $this->sendResponse($readings, 'Datos del index obtenidos con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function biomasseId($sowingId)
    {
        try {
            $biomasseId = $this->mortalitiesService->getBiomasseId($sowingId);
            return $this->sendResponse($biomasseId, 'Id de la biomasa obtenida con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function store(MortalityCreateRequest $request, $sowingId)
    {
        try {
            $biomasseId = $this->mortalitiesService->store($request,$sowingId);
            return $this->sendResponse($biomasseId, 'Mortalidad registrada con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function view($mortalityId)
    {
        try {
            $mortalityInfo = $this->mortalitiesService->getMortalityInfo($mortalityId);
            return $this->sendResponse($mortalityInfo, 'Datos de la mortalidad obtenidos con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function update(MortalityUpdateRequest $request, $mortalityId)
    {
        try {
            $this->mortalitiesService->update($request,$mortalityId);
            return $this->sendResponse(true, 'Datos de la mortalidad actualizados con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function destroy($mortalityId)
    {
        try {
            $info = $this->mortalitiesService->destroy($mortalityId);
            if($info["status"])
                return $this->sendResponse(true, $info["msg"]);
            return $this->sendError($info["msg"]);
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
}
