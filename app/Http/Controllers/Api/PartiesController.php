<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\PartiesService;
use App\Http\Requests\PartyCreateRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Validator;

  
class PartiesController extends BaseController
{

    public function __construct(private PartiesService $partiesService  ){}



    public function getPartiesByRoleId($partyRoleId = -1)
    {
        try {

            $info = $this->partiesService->getPartiesByRoleId($partyRoleId);
            return $this->sendResponse($info, 'Información obtenida con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    }
    public function getPartyInfoById($partyId = -1)
    {
        try {

            $info = $this->partiesService->getPartieInfoById($partyId);
            if($info){
                return $this->sendResponse($info, 'Información obtenida con éxito');
            }
            return $this->sendError('Error.', "No se econtró el usuario.");
            
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    }

    /**
     * Create a party profile information.
     */
    public function storeParty(PartyCreateRequest $request)
    {
        try {

            $this->partiesService->storeParty($request);

            return $this->sendResponse(true, 'Persona creada correctamente');

        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    }

    /**
     * Update a party profile information.
     */
    public function updateParty(PartyCreateRequest $request, $partyId = -1)
    {
        try {

            $this->partiesService->updateParty($request, $partyId);

            return $this->sendResponse(true, 'Persona actualizada correctamente');

        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    }
    /**
     * Delete a party .
     */
    public function deleteParty($partyId = -1)
    {
        try {

            $status = $this->partiesService->deleteParty($partyId);
            if($status['success']){
                return $this->sendResponse(true, $status['msg']);
            }else{
                return $this->sendError('Error.', $status['msg']);
            }

        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    }

}
