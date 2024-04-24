<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\PartiesService;
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
}
