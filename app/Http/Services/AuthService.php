<?php

namespace App\Http\Services;

use App\Models\User;
use App\Models\Role;
use App\Models\ProductiveUnit;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\UpdatePasswordRequest;
use App\Http\Controllers\Api\BaseController as BaseController;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Validator;

class AuthService {


    //metodo que permite hacer login de un usuario usando tokens de laravel sanctum
    public function loginApi(LoginRequest $loginRequest){
        $loginBody = $loginRequest->all();
        $loginRequest->authenticate();
        $authUser = Auth::user();
        $success['token'] =  $authUser->createToken(env('APP_KEY'))->plainTextToken;
        $success['profile'] = $authUser;

        if($loginBody["fcm_token"]) {
            User::where("id", $authUser->id)->update(["fcm_token" => $loginBody["fcm_token"]]);
        }

        return $success;
    }
    public function register(Request $request){
        $user = User::create([
            'name' => $request->name,
            'document' => $request->document,
            'email' => $request->email,
            'role_id' => $request->role_id,
            'productive_unit_id' => $request->productive_unit_id,
            'password' => Hash::make($request->password),
        ]);

        //agregamos el rol por defecto
        event(new Registered($user));

        Auth::login($user);
        $userInfo['token'] = $user->createToken(env('APP_KEY'))->plainTextToken;
        $userInfo['user'] = $user;
        return $userInfo;
    }
    public function logoutApi(){
        Auth::user()->tokens()->delete();
    }
    public function sendPasswordRecoveryEmail($email = ""){
        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        $status = Password::sendResetLink($email);
        return $status;
    }
    public function resetPassword($resetInfo = []){
            // Here we will attempt to reset the user's password. If it is successful we
            // will update the password on an actual user model and persist it to the
            // database. Otherwise we will parse the error and return the response.
            $status = Password::reset(
                $resetInfo,
                function ($user) use ($resetInfo) {
                    $user->forceFill([
                        'password' => Hash::make($resetInfo['password']),
                        'remember_token' => Str::random(60),
                    ])->save();
                    event(new PasswordReset($user));
                }
            );
            return $status;
    }

    //permite verificar el email
    public function verifyEmail(){
        $user = Auth::user();
        if(!$user->hasVerifiedEmail()){
            if ($user->markEmailAsVerified())
                event(new Verified($user));
        }
    }

    //in case the user has not verified the emaio, send the sendEmailVerificationNotification
    public function sendVerificationEmailNotification(Request $request){
        if ($request->user()->hasVerifiedEmail()) {
            return false;
        }
        $request->user()->sendEmailVerificationNotification();
        return true;
    }
    public function confirmPassword(Request $request){

           if (! Auth::guard('web')->validate([
            'email' => $request->user()->email,
            'password' => $request->password,
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }
    }
    public function updatePassword(UpdatePasswordRequest $updatePasswordRequest){
        Auth::user()->update([
            'password' => Hash::make($updatePasswordRequest->password),
        ]);
    }
}

