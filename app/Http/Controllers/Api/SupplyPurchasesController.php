<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\SupplyPurchasesService;
use App\Http\Requests\SupplyPurchasesCreateRequest;
use App\Http\Requests\SupplyPurchasesUpdateRequest;

  
class SupplyPurchasesController extends BaseController
{

    public function __construct(private SupplyPurchasesService $supplyPurchasesService  ){}



    public function store(SupplyPurchasesCreateRequest $request)
    {
        try {
            $this->supplyPurchasesService->store($request);
            return $this->sendResponse(true, 'Compra de suministros registrada con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function view($supplyPurchaseId)
    {
        try {
            $supplyPurchaseInfo = $this->supplyPurchasesService->view($supplyPurchaseId);
            return $this->sendResponse($supplyPurchaseInfo, 'Compra de suministros registrada con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function update(SupplyPurchasesUpdateRequest $request, $supplyPurchaseId)
    {
        try {
             $this->supplyPurchasesService->update($request,$supplyPurchaseId);
            return $this->sendResponse(true, 'Compra de suministros actualizada con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function destroy($supplyPurchaseId)
    {
        try {
            $deletionResponse = $this->supplyPurchasesService->destroy($supplyPurchaseId);
            if($deletionResponse["status"]){
                return $this->sendResponse(true, $deletionResponse["msg"]);
            }
            return $this->sendError($deletionResponse["msg"]);
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
}
