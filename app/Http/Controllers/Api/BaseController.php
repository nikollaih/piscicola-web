<?php

namespace App\Http\Controllers\Api;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller as Controller;

//constantes que almacenan los identificadores de cada tipo de usuario
define('ADMINISTRADOR', config('constants.ROLES_ID.ID_ADMINISTRADOR'));
define('MANAGER', config('constants.ROLES_ID.ID_MANAGER'));
define('ASISTENTE', config('constants.ROLES_ID.ID_ASISTENTE'));

class BaseController extends Controller
{
    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */
    public function sendResponse($result, $message)
    {
    	$response = [
            'success' => true,
            'data'    => $result,
            'message' => $message,
        ];
        return response()->json($response, 200);
    }
    /**
     * return error response.
     *
     * @return \Illuminate\Http\Response
     */
    public function sendError($error, $errorMessages = [])
    {
    	$response = [
            'success' => false,
            'message' => $error,
        ];
        if(!empty($errorMessages)){
            $response['data'] = $errorMessages;
        }
        return response()->json($response, 200);
    }
}
