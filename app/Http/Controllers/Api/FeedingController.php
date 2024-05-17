<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\FeedingService;
use Illuminate\Http\Request;
use App\Http\Requests\SupplyUseCreateRequest;
use App\Http\Requests\SupplyUseUpdateRequest;
 
class FeedingController extends BaseController
{

    public function __construct(private FeedingService $feedingService  ){}



    public function readings(Request $request, $sowingId, $biomasseIdOne = null, $biomasseIdTwo = null)
    {
        try {
            $readings = $this->feedingService->readings($request,$sowingId,$biomasseIdOne,$biomasseIdTwo);
            return $this->sendResponse($readings, 'Lecturas obtenidas con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function index($sowingId)
    {
        try {
            $readings = $this->feedingService->index($sowingId);
            return $this->sendResponse($readings, 'Lecturas obtenidas con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function infoToCreate($sowingId)
    {
        try {
            $info = $this->feedingService->infoToCreate($sowingId);
            return $this->sendResponse($info, 'Datos para la creación de una alimentación obtenidos con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function store(SupplyUseCreateRequest $request)
    {
        try {
            $this->feedingService->store($request);
            return $this->sendResponse(true, 'Alimentación creada con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function view($feedingId)
    {
        try {
            $feedingInfo = $this->feedingService->view($feedingId);
            return $this->sendResponse($feedingInfo, 'Alimentación obtenida con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function update(SupplyUseUpdateRequest $request, $feedingId)
    {
        try {
             $this->feedingService->update($request,$feedingId);
            return $this->sendResponse(true, 'Alimentación actualizada con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function destroy($feedingId)
    {
        try {
             $deletionResponse = $this->feedingService->destroy($feedingId);
             if($deletionResponse["status"]){return $this->sendResponse(true, $deletionResponse["msg"]);}
             return $this->sendError($deletionResponse["msg"]);
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
}
