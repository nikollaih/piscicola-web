<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use Illuminate\Http\Request;
use App\Http\Services\ProfileService;
use App\Http\Requests\ProfileUpdateRequest;

class ProfileController extends BaseController
{
    public function __construct(private ProfileService $profileService  ){}
    
    public function edit(Request $request)
    {
        try {
            $info  = $this->profileService->getMustVerify($request);
            return $this->sendResponse($info, 'Datos obtenidos con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function update(ProfileUpdateRequest $request){
        try {
            $this->profileService->update($request);
            return $this->sendResponse(true, 'Datos del perfil actualizados con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }

    public function destroy(Request $request){
        try {
            $this->profileService->destroy($request);
            return $this->sendResponse(true, 'Datos del perfil borrados con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }

}
