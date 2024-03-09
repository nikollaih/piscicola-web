<?php

namespace App\Http\Requests;

use App\Models\Supply;
use Illuminate\Foundation\Http\FormRequest;

class SupplyUseCreateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        $maxQuantity = Supply::findOrFail($this->supply_id)->available_quantity;

        return [
            'supply_id' => ['required'],
            'biomasse_id' => ['required'],
            'quantity' => ['required', 'numeric', 'max:' . $maxQuantity],
            'manual_created_at' => ['required']
        ];
    }
}
