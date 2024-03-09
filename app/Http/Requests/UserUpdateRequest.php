<?php

namespace App\Http\Requests;

use App\Models\Party;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        $userId = $this->route('userId');

        return [
            'document' => ['required', 'numeric', Rule::unique(User::class)->ignore($userId)],
            'name' => ['required', 'min:5'],
            'mobile_phone' => ['required', 'min:10'],
            'email' => ['required', 'email', Rule::unique(User::class)->ignore($userId)],
            'role_id' => ['required']
        ];
    }
}
