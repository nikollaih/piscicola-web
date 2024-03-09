<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MortalityCreateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'biomasse_id' => ['required', 'numeric'],
            'sample_quantity' => ['required'],
            'dead' => ['required'],
            'manual_created_at' => ['required']
        ];
    }
}
