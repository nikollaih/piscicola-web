<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\ProductiveUnitsService;
use App\Http\Requests\ProductiveUnitCreateRequest;
use Illuminate\Support\Facades\Auth;

class ProductiveUnitsController extends BaseController
{
    public function __construct(private ProductiveUnitsService $productiveUnitsService  ){}

    
    public function index()
    {
        try {
            $sessionUserRole = Auth::user()->role_id;
            $productiveUnits = [];
            if ($sessionUserRole == ADMINISTRADOR){
                $productiveUnits = $this->productiveUnitsService->getAllProductiveUnits();
            }
            if($sessionUserRole == MANAGER || $sessionUserRole == ASISTENTE){
                $productiveUnits[0] = $this->productiveUnitsService->getProductiveUnitBySessionUser();
            }
            return $this->sendResponse($productiveUnits, 'Datos de las unidades productivas obtenidos con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function allAssociations()
    {
        try {
            $associations = $this->productiveUnitsService->getAllAssociations();
            return $this->sendResponse($associations, 'Asociaciones obtenidas con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function store(ProductiveUnitCreateRequest $request)
    {
        try {
            $productiveUnitStored = $this->productiveUnitsService->store($request);
            return $this->sendResponse($productiveUnitStored, 'Unidad productiva creada  con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }

    public function view($productiveUnitId) {
        try {
            $productiveUnitInfo = $this->productiveUnitsService->view($productiveUnitId);
            return $this->sendResponse($productiveUnitInfo, 'Unidad productiva obtenida  con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }

    public function update(ProductiveUnitCreateRequest $request, $productiveUnitId)
    {
        try {
            $this->productiveUnitsService->update($request,$productiveUnitId);
            return $this->sendResponse(true, 'Unidad productiva actualizada  con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function destroy($productiveUnitId)
    {
        try {
            $deletionResoults  = $this->productiveUnitsService->destroy($productiveUnitId);
            if($deletionResoults["status"])
                return $this->sendResponse(true, $deletionResoults["msg"]);
            return $this->sendError($deletionResoults["msg"]);
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
}
