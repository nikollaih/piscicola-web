<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\SowingsService;
use App\Http\Requests\SowingCreateRequest;
use App\Http\Requests\SowingUpdateRequest;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Response;

class SowingsController extends BaseController 
{

    public function __construct(private SowingsService $sowingService  ){}
    /**
     * Display sowings listing
     */
    public function getSowingsList()
    {
        try {

            $sowings = $this->sowingService->getSowingsList();

            return $this->sendResponse($sowings, 'Siembras obtenidas correctamente');
        
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    
    }

    public function getCreateInfo() 
    {
        try {

            $createInfo = $this->sowingService->getCreateInfo();

            return $this->sendResponse($createInfo, 'datos para la creación de una siembra obtenidos correctamente');
        
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }

    }

    /**
     * Create a new sowing.
     */
    public function storeSowing(SowingCreateRequest $request)
    {
        try {

            $this->sowingService->storeSowing($request);

            return $this->sendResponse(true, 'Siembra creada correctamente');
        
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    
    }

    /**
     * Update the supply's profile information.
     */
    public function updateSowing(SowingUpdateRequest $request, $sowingId)
    {
        try {

            $this->sowingService->updateSowing($request,$sowingId);

            return $this->sendResponse(true, 'Siembra actualizada correctamente');
        
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }

    }

    /**
     * Display the user's profile information.
     */
    public function view($sowingId)
    {
        try {

            $resume = $this->sowingService->getSowingView($sowingId);

            return $this->sendResponse($resume, 'Detalles de la siembra obtenidos correctamente');
        
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
        
    }

    /**
     * Delete the sowing row
    */
    public function destroySowing($sowingId)
    {
        try {

            $info = $this->sowingService->destroySowing($sowingId);
            if($info['status'])
                return $this->sendResponse(true, 'Detalles de la siembra obtenidos correctamente');
            return $this->sendError('Error.', $info['msg']);

        
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }

        
    }

    public function resumeSowing($sowingId)
    {
        try {

            $resume = $this->sowingService->getSowingResume($sowingId);

            return $this->sendResponse($resume, 'Detalles de la siembra obtenidos correctamente');
        
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }

        
    }
}
