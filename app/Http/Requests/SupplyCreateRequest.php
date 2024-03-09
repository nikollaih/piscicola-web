<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SupplyCreateRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'measurement_unit_id' => ['required', 'numeric'],
            'name' => ['required'],
            'use_type' => ['required'],
            'total_price' => ['required'],
            'quantity' => ['required'],
            'manual_created_at' => ['required']
        ];
    }
}
