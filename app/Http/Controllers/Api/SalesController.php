<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\SalesService;
use App\Http\Requests\SalesCreateRequest;

class SalesController extends BaseController
{
    public function __construct(private SalesService $salesService  ){}

    
    public function index()
    {
        try {
            $indexInfo = $this->salesService->index();
            return $this->sendResponse($indexInfo, 'Datos del index obtenidos con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function infoToCreate($sowingId) {
        try {
            $infoToCreate = $this->salesService->getInfoToCreate($sowingId);
            return $this->sendResponse($infoToCreate, 'Datos necesarios para crear una venta obtenidos con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
   
    public function store(SalesCreateRequest $request, $sowingId){
        try {
            $saleCreated = $this->salesService->store($request,$sowingId);
            return $this->sendResponse($saleCreated, 'Venta creada con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }

    public function view($saleId) {
        try {
            $saleInfo = $this->salesService->view($saleId);
            return $this->sendResponse($saleInfo, 'Datos de la venta obtenidos con éxito');
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }

    public function update(SalesCreateRequest $request, $saleId) {
         try {
            $this->salesService->update($request,$saleId);
            return $this->sendResponse(true, 'Venta actualizada con éxito');
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function destroy($saleId){
         try {
            $deletionStatus = $this->salesService->destroy($saleId);
            if($deletionStatus["sucess"])
                return $this->sendResponse(true, $deletionStatus["msg"]);
            return $this->sendError($deletionStatus["msg"]);
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
 
    }
}
