<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
//constantes que almacenan los identificadores de cada tipo de usuario
define('ADMINISTRADOR', config('constants.ROLES_ID.ID_ADMINISTRADOR'));
define('MANAGER', config('constants.ROLES_ID.ID_MANAGER'));
define('ASISTENTE', config('constants.ROLES_ID.ID_ASISTENTE'));
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
