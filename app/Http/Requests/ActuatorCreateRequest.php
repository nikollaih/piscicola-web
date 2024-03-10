<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ActuatorCreateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'pond_id' => ['required'],
            'actuator_type_id' => ['required'],
            'name' => ['required'],
            'cost_by_minute' => ['required']
        ];
    }
}
