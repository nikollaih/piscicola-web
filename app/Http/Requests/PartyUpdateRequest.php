<?php

namespace App\Http\Requests;

use App\Models\Party;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PartyUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        $partyId = $this->route('partyId');

        return [
            'document' => ['required', 'min:7', Rule::unique(Party::class)->ignore($partyId)],
            'name' => ['required', 'string', 'min:5'],
            'mobile_phone' => ['required', 'min:10'],
            'email' => [
                'required',
                'email',
                Rule::unique(Party::class)->ignore($partyId)
            ],
            'city_id' => ['required']
        ];
    }
}
