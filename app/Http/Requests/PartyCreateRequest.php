<?php

namespace App\Http\Requests;

use App\Models\Party;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PartyCreateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'document' => 'required|min:7|unique:clients',
            'name' => 'required|string|min:5',
            'mobile_phone' => 'required|min:10',
            'email' => 'required|email|unique:clients',
            'city_id' => 'required'
        ];
    }
}
