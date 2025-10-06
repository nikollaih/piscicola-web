<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ManualReadingRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'step_id' => ['required'],
            'step_stat_id' => ['required'],
            'value' => ['required'],
            'topic_time' => ['required'],
            'sowing_id' => ['required'],
        ];
    }
}
