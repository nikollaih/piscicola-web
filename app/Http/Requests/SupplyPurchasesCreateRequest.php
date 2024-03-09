<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SupplyPurchasesCreateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'supply_id' => ['required'],
            'price' => ['required'],
            'quantity' => ['required'],
            'manual_created_at' => ['required']
        ];
    }
}
