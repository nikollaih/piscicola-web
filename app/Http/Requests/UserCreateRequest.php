<?php

namespace App\Http\Requests;

use App\Models\Party;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserCreateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'document' => ['required', 'numeric', Rule::unique(User::class)],
            'name' => ['required', 'min:5'],
            'mobile_phone' => ['required', 'min:10'],
            'email' => ['required', 'email', Rule::unique(User::class)],
            'role_id' => ['required'],
            'password' => ['required', 'confirmed', 'min:8'],
        ];
    }
}
