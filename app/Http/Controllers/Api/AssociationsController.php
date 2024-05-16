<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\AssociationsService;
use App\Http\Requests\AssociationCreateRequest;

class AssociationsController extends BaseController
{
    public function __construct(private AssociationsService $associationsService  ){}

    
    public function index()
    {
        try {
            $indexInfo = $this->associationsService->index();
            return $this->sendResponse($indexInfo, 'Datos del index obtenidos con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function store(AssociationCreateRequest $request)
    {
        try {
            $associationStored = $this->associationsService->store($request);
            return $this->sendResponse($associationStored, 'Asociación creada con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function view($associationId)
    {
        try {
            $association = $this->associationsService->getAssociation($associationId);
            return $this->sendResponse($association, 'Asociación creada con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function update(AssociationCreateRequest $request, $associationId)
    {
        try {
            $this->associationsService->update($request,$associationId);
            return $this->sendResponse(true, 'Asociación actualizada con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function destroy($associationId)
    {
        try {
            $deletionInfo = $this->associationsService->destroy($associationId);
            if($deletionInfo["status"])
                return $this->sendResponse(true, $deletionInfo["msg"]);
            return $this->sendError($deletionInfo["msg"]);
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }

}
