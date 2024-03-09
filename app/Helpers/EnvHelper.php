<?php

namespace App\Helpers;

class EnvHelper
{
    public static function getRoles()
    {
        return [
            'ROLE_ADMIN' => env('ROLE_ADMIN'),
            'ROLE_ADMIN_LAYER' => env('ROLE_ADMIN_LAYER'),
            'ROLE_LAYER' => env('ROLE_LAYER'),
            'ROLE_ASSISTANT' => env('ROLE_ASSISTANT'),
        ];
    }
}
