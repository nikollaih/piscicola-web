<?php

namespace App\Http\Controllers\Api;

use App\Http\Services\BiomassesService;
use App\Http\Requests\CreateBiomasseRequest;
use App\Http\Controllers\Api\BaseController as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Response;

class BiomassesController extends BaseController 
{

    public function __construct(private BiomassesService $biomassesService  ){}
    /**
     * Display sowings listing
     */
    public function getAllBySowing($sowingId)
    {
        try {
            $biomasses = $this->biomassesService->getAllBySowing($sowingId);

            return $this->sendResponse($biomasses, 'Biomasas obtenidas correctamente');
        
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    
    }
    public function getIndexInfo($sowingId)
    {
        try {
            $info = $this->biomassesService->getIndexInfo($sowingId);

            return $this->sendResponse($info, 'Biomasas obtenidas correctamente');
        
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    
    }
    /**
     * returns the readings of one or two biomasses by id 
     */
    public function getBiomasseReadings($sowingId, $biomasseIdOne = null, $biomasseIdTwo = null)
    {
        try {
            $readings = $this->biomassesService->getBiomasseReadings($sowingId, $biomasseIdOne = null, $biomasseIdTwo = null);

            return $this->sendResponse($readings, 'Lecturas obtenidas correctamente');
        
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    
    }

    public function storeBiomasse(CreateBiomasseRequest $request)
    {
        try {
             $this->biomassesService->storeBiomasse($request);

            return $this->sendResponse(true, 'Biomasa creada correctamente');
        
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    
    }
    public function getBiomasseInfo($biomasseId)
    {
        try {
            $biomasseInfo = $this->biomassesService->getBiomasseInfo($biomasseId);

            return $this->sendResponse($biomasseInfo, 'Biomasa creada correctamente');
        
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    
    }
    public function updateBiomasse(CreateBiomasseRequest $request, $biomasseId)
    {
        try {
            $this->biomassesService->updateBiomasse($request,$biomasseId);
            return $this->sendResponse(true, 'Biomasa actualizada  correctamente');
        
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    
    }
    public function destroyBiomasse($biomasseId)
    {
        try {
            $deletionResponse = $this->biomassesService->destroyBiomasse($biomasseId);
            if($deletionResponse["status"])
                return $this->sendResponse(true,$deletionResponse["msg"] );
            return $this->sendError($deletionResponse["msg"]);
        
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
}
