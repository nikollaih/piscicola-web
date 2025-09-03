<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SensorMaintenanceCreateRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'pond_id'        => ['required', 'integer', 'exists:ponds,id'],
            'sensor_name'    => ['nullable', 'string', 'max:150'],
            'operator_name'  => ['nullable', 'string', 'max:150'],
            'maintenance_at' => ['required', 'date'],
            'observations'   => ['nullable', 'string', 'max:5000'],
            'next_maintenance_at' => ['nullable', 'date'],
            'evidence'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ];
    }
}
