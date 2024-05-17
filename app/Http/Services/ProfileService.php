<?php

namespace App\Http\Services;

use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RequestGuard;

class ProfileService {

    public function getMustVerify(Request $request)
    {
        return [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail
        ];
    }

    public function update(ProfileUpdateRequest $request){
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }
        $request->user()->save();
        return $request->user(); 
    }
    /**
     * Delete the user's account.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        //Intenta cerrar la sesion web 
        try {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        } catch (\Throwable $th) {
        } 

        //Intenta borrar los tokens api 
        try {
            Auth::user()->tokens()->delete();

        } catch (\Throwable $th) {
        }

        $request->user()->delete(); // Para eliminar el usuario

    }
}