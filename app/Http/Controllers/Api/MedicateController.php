<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\MedicateService;
use App\Http\Requests\SupplyUseCreateRequest;
use App\Http\Requests\SupplyUseUpdateRequest;
use Illuminate\Http\Request;

class MedicateController extends BaseController
{
    public function __construct(private MedicateService $medicateService  ){}



    public function readings(Request $request, $sowingId, $biomasseIdOne = null, $biomasseIdTwo = null)
    {
        try {
            $readings = $this->medicateService->readings($request,$sowingId,$biomasseIdOne,$biomasseIdTwo);
            return $this->sendResponse($readings, 'Lecturas obtenidas con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function index($sowingId)
    {
        try {
            $readings = $this->medicateService->index($sowingId);
            return $this->sendResponse($readings, 'Indice obtenidas con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function infoToCreate($sowingId)
    {
        try {
            $readings = $this->medicateService->getInfoToCreate($sowingId);
            return $this->sendResponse($readings, 'Información para la creación de suministro de medicina obtenida con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function store(SupplyUseCreateRequest $request)
    {
        try {
             $this->medicateService->store($request);
            return $this->sendResponse(true, 'Creación de suministro de medicina con éxito');
            
        } catch (\Throwable $th) {
           return $this->sendError($th->getMessage());
        }
    }
    public function view($feedingId)
    {
        try {
            $info = $this->medicateService->view($feedingId);
            return $this->sendResponse($info, 'Información del suministro de medicina obtenida con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function update(SupplyUseUpdateRequest $request, $feedingId)
    {
        try {
             $this->medicateService->update($request,$feedingId);
            return $this->sendResponse(true, 'Información del suministro de medicina actualizada con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function destroy($feedingId)
    {
        try {
             $this->medicateService->destroy($feedingId);
            return $this->sendResponse(true, 'Información del suministro de medicina actualizada con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
}
