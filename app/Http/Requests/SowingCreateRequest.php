<?php

namespace App\Http\Requests;

use App\Models\Sowing;
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
            'name' => ['required'],
            'fish_id' => ['required', 'numeric'],
            'step_id' => ['required', 'numeric'],
            'check_interval' => ['required', 'numeric'],
            'pond_id' => [
                'required',
                'numeric',
                function ($attribute, $value, $fail) {
                    // Verificar si el pond_id está siendo utilizado en un Sowing
                    $existingSowing = Sowing::where('pond_id', $value)
                        ->where('sale_date', null)
                        ->exists();

                    // Si existe un Sowing con el pond_id especificado, la validación falla
                    if ($existingSowing) {
                        $fail('El estanque no está disponible.');
                    }
                }
            ],
            'quantity' => ['required']
        ];
    }

    public function messages()
    {
        return [
            'fish_id.required' => 'El campo producto es requerido.',
            'fish_id.numeric' => 'El campo producto debe ser numérico.',
            'pond_id.required' => 'El campo estanque es requerido.',
            'pond_id.numeric' => 'El campo estanque debe ser numérico.',
            'step_id.required' => 'El campo etapa es requerido.',
            'step_id.numeric' => 'El campo etapa debe ser numérico.',
            'quantity.required' => 'El campo cantidad es requerido.',
            'check_interval.required' => 'El campo minutos de alertas es requerido.',
        ];
    }
}
