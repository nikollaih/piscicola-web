<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\PondsService;
use App\Http\Requests\PondCreateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Response;

class PondsController extends BaseController 
{

    public function __construct(private PondsService $pondsService  ){}

    /**
     * returns all ponds
     */
    public function getAllPonds()
    {
        try {
            $ponds = $this->pondsService->getAllPonds();
            return $this->sendResponse($ponds, 'Estanques obtenidos correctamente');
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    
    }
    /**
     * save a pond
     */
    public function storePond(PondCreateRequest $request)
    {
        try {
            $info = $this->pondsService->storePond($request);
            if($info['success'])
                return $this->sendResponse($info['pond'], 'Estanque creado correctamente');
            return $this->sendError('Error.', 'Ocurrió un error al crear el estanque');
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    
    }
    /**
     *  allows to edit a pond
     */
    public function getPond($pondId = -1)
    {
        try {
            $pond = $this->pondsService->getPond($pondId);
            return $this->sendResponse($pond, 'Estanque creado correctamente');
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    
    }
    /**
     * update a pond
     */
    public function updatePond(PondCreateRequest $request,$pondId)
    {
        try {
            $info = $this->pondsService->updatePond($request,$pondId);
            return $this->sendResponse(true, 'Estanque actualizado correctamente');
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    
    }
    /**
     * destroy a pond
     */
    public function destroyPond($pondId)
    {
        try {
            $info = $this->pondsService->destroyPond($pondId);
            if($info['status'])
                return $this->sendResponse(true, $info['msg']);
            return $this->sendError("Error Al eliminar un estanque", $info['msg']);
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    
    }
}
