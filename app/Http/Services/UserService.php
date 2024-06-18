<?php

namespace App\Http\Services;

use App\Models\User;
use App\Helpers\EnvHelper;
use App\Http\Requests\UserCreateRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Controllers\Api\BaseController as BaseController;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Verified;
use Validator;

class UserService {

    public function getUserList(Request $request, $productiveUnitId = null)
    {

        $searchValue = $request->input('search');
        $user = Auth::user();
        $productiveUnit = ($productiveUnitId && $user->role_id === 1) ? $productiveUnitId : $user->productive_unit_id;

        if($request->has('search')){
            $users = User::where('productive_unit_id', $productiveUnit)
                ->with('role')
                ->where('document', 'LIKE', "%{$searchValue}%")
                ->orWhere('name', 'LIKE', "%{$searchValue}%")
                ->orderBy('name', 'asc')
                ->paginate(10);
        }
        else {
            $users = User::where('productive_unit_id', $productiveUnit)
                ->with('role')
                ->orderBy('name', 'asc')
                ->paginate(10);
        }
        return $users;

    }

    public function getUserInformation($userId = -1){

        $userInfo['loggedUser'] = $loggedUser = User::with('role')->find(Auth::id());
        $userInfo['user'] = User::with('role')->find($userId);
        $userInfo['roles'] = EnvHelper::getRoles();

        return $userInfo;
        }

    public function addNewUser(UserCreateRequest $request, $productiveUnitId = null){

            $userRequest = $request->all();
            $user = Auth::user();
            $productiveUnitId = ($productiveUnitId && $user->role_id === 1) ? $productiveUnitId : $user->productive_unit_id;

            $userRequest["productive_unit_id"] = $productiveUnitId;
            User::create($userRequest);

        }
    /**
     * Update the user's profile information.
     */
    public function updateUser(UserUpdateRequest $request, $userId)
    {
        $userRequest = $request->all();
        User::where('id', $userId)->update($userRequest);
    }

    public function restorePassword(Request $request, $userId)
    {
        // Get the logged user instance
        $loggedUser = Auth::user();
        // Get the user is supposed to be deleted
        $user = User::where('id', $userId)
            ->first();

        // If the user exists
        if($user && $loggedUser->role_id <= 2){
            $restored = User::where('id', $userId)->update(['password' => Hash::make(env('DEFAULT_PASSWORD'))]);
            // Do the soft delete
            if($restored){
                // Return a confirmation message
                return ["status" => true, "msg" => "Contraseña restablecida exitosamente" ] ;
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return ["status" => false, "msg" => "No ha sido posible restaurar la contraseña el usuario" ] ;
            }
        }
        else {
            // If the user doesn't exist
            return ["status" => false, "msg" => "El usuario no existe" ] ;
        }
    }
    /**
     * Delete the user's account.
     */
    public function destroy($userId, $loggedUserId)
    {
        // Get the user is supposed to be deleted
        $user = User::where('id', $userId)
            ->first();

        // If the user exists
        if($user != null){
            // Do the soft delete
            if($user->delete()){
                if($loggedUserId === $user->id){
                    Auth::logout();
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();
                }
                // Return a confirmation message
                return ["msg" => "Usuario eliminado satisfactoriamente","status" => true];
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return ["msg" => "No ha sido posible eliminar el usuario","status" => false];
            }
        }
        else {
            // If the user doesn't exist
            return ["msg" => "El usuario no existe","status" => false];
        }
    }

}
