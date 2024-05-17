<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\SuppliesService;
use App\Http\Requests\SupplyCreateRequest;
use App\Http\Requests\SupplyUpdateRequest;

  
class SuppliesController extends BaseController
{

    public function __construct(private SuppliesService $suppliesService  ){}



    public function getAllSupplies()
    {
        try {

            $supplies = $this->suppliesService->getAllSupplies();
            return $this->sendResponse($supplies, 'Suministros obtenidos con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    }
    public function getMeasurements()
    {
        try {

            $measurements = $this->suppliesService->getMeasurements();
            return $this->sendResponse($measurements, 'Mediciones obtenidas con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    }
    public function storeSupply(SupplyCreateRequest $request)
    {
        try {

             $this->suppliesService->storeSupply($request);
            return $this->sendResponse(true, 'Mediciones obtenidas con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function destroySupply($supplyId)
    {
        try {

            $destroyInfo = $this->suppliesService->destroySupply($supplyId);
            if($destroyInfo["status"]){
                return $this->sendResponse(true, $destroyInfo["msg"]);
            }
            return $this->sendError($destroyInfo["msg"]);
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function viewSupply($supplyId)
    {
        try {

            $supplyInfo = $this->suppliesService->getSupplyInfo($supplyId);
            return $this->sendResponse($supplyInfo,"Datos del suministro obtenidos con éxito" );
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function updateSupply(SupplyUpdateRequest $request,$supplyId)
    {
        try {
            $this->suppliesService->updateSupply($request,$supplyId);
            return $this->sendResponse(true,"Datos del suministro actualizados con éxito" );
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }

}
