<?php

namespace App\Http\Middleware;

use App\Models\Sowing;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSaleDate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get the sowingId from the URL
        $sowingId = $request->route('sowingId');

        // Verifica si la solicitud está realizando una creación o edición de Sowing
        if (preg_match('/(store|update|create|edit)/', $request->path())) {
            if($sowingId !== null){
                // Busca el Sowing por su ID si está presente en la solicitud, de lo contrario, usa el Sowing existente
                $sowing = $request->has('sowing_id') ? Sowing::find($request->input('sowing_id')) : Sowing::find($sowingId);

                // Si el Sowing no se encuentra o si sale_date está vacío, redirige con un mensaje de error
                if (!$sowing || $sowing->sale_date !== null) {
                    return redirect()->back()->with('error', 'Sowing not found.');
                }
            }
        }

        // Proceed with the request if everything is fine
        return $next($request);
    }
}
