<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SensorMaintenanceUpdateRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'pond_id'              => ['sometimes', 'integer', 'exists:ponds,id'],
            'sensor_name'          => ['sometimes', 'nullable', 'string', 'max:150'],
            'operator_name'        => ['sometimes', 'nullable', 'string', 'max:150'],
            'maintenance_at'       => ['sometimes', 'date'],
            'observations'         => ['sometimes', 'nullable', 'string', 'max:5000'],
            'next_maintenance_at'  => ['sometimes', 'nullable', 'date'],
            'evidence'             => ['sometimes', 'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ];
    }
}
