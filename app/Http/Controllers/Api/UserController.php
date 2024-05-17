<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\UserService;
use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserUpdateRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Validator;

  
class UserController extends BaseController
{

    public function __construct(private UserService $userService  ){}



    public function getUserList(Request $request, $productiveUnitId = null)
    {
        try {

            $info = $this->userService->getUserList($request, $productiveUnitId);
            return $this->sendResponse($info, 'Información obtenida con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    }
    public function getUserInformation($userId = -1){
        try {

            $info = $this->userService->getUserInformation($userId);
            return $this->sendResponse($info, 'Información obtenida con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }

    }
    public function addNewUser(UserCreateRequest $request, $productiveUnitId = null){
         try {

            $info = $this->userService->addNewUser($request,$productiveUnitId);
            return $this->sendResponse($info, 'Usuario creado con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    }
    /**
     * Update the user's profile information.
     */
    public function updateUser(UserUpdateRequest $request, $userId)
    {
        try {

            $info = $this->userService->updateUser($request,$userId);
            return $this->sendResponse($info, 'Usuario actualizado con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    }
    public function restorePassword(Request $request, $userId)
    {
        try {

            $info = $this->userService->restorePassword($request,$userId);
            if($info['status']){
                return $this->sendResponse(true, $info['msg']);
            }
            return $this->sendError('Error.', $info['msg']);
            
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    }


    /**
     * Delete the user's account.
     */
    public function destroy(Request $request, $userId)
    {
        try {

        $info = $this->userService->destroy(Auth::user()->productive_unit_id,$userId,Auth::user()->id);

        if($info['status']){
            return $this->sendResponse(true, $info['msg']);
        }
        return $this->sendError('Error.', $info['msg']);
        
        } catch (\Throwable $th) {
            return $this->sendError('Error.', ['error'=>$th->getMessage()]);
        }
    
    }

}
