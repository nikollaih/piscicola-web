<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SowingCreateRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fish_id' => ['required', 'numeric'],
            'step_id' => ['required', 'numeric'],
            'pond_id' => ['required', 'numeric'],
            'quantity' => ['required']
        ];
    }
}
