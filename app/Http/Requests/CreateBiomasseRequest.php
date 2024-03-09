<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateBiomasseRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'sowing_id' => ['required', 'numeric'],
            'approximate_weight' => ['required'],
            'quantity_of_fish' => ['required'],
            'manual_created_at' => ['required']
        ];
    }
}
