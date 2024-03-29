<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PondCreateRequest extends FormRequest
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
            'area' => ['required'],
            'volume' => ['required'],
            'entrance' => ['required'],
            'exit' => ['required'],
            'covered' => ['required']
        ];
    }
}
