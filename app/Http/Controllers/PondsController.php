<?php

namespace App\Http\Controllers;

use App\Http\Requests\PondCreateRequest;
use App\Models\Mortality;
use App\Models\Pond;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

class PondsController extends Controller
{
    /**
     * Display mortalities listing
     */
    public function index(Request $request): Response
    {
        $Pond = new Pond();
        $ponds = $Pond->getAll();

        return \inertia('Ponds/Index', [
            'ponds' => $ponds,
            'csrfToken' => csrf_token()
        ]);
    }

    public function create (): Response {
        return \inertia('Ponds/Create', [
            'formActionUrl' => route('pond.store')
        ]);
    }

    public function store (PondCreateRequest $request) {
        $user = Auth::user();
        $pondRequest = $request->all();
        $pondRequest["productive_unit_id"] = $user->productive_unit_id;

        $pond = Pond::create($pondRequest);

        // Api response
        if($request->is('api/*')){
            if($pond){
                $Pond = Pond::class;
                return response()->json($Pond::find($pond->id), 200);
            }
            return response()->json([], 500);
        }
    }

    public function edit ($pondId) {
        $pond = Pond::find($pondId);

        return \inertia('Ponds/Create', [
            'pond' => $pond,
            'formActionUrl' => route('pond.update', ['pondId' => $pondId])
        ]);
    }

    public function update (PondCreateRequest $request, $pondId) {
        $pondRequest = $request->all();
        Pond::where('id', $pondId)->update($pondRequest);
    }

    /**
     * Delete the mortality row
     */
    public function destroy($pondId): JsonResponse
    {
        $Pond = new Pond();
        // Get the mortality the user is trying to delete
        $pond = Pond::find($pondId);

        // If the user exists
        if($pond){
            if(!$Pond->isUsed($pondId)){
                // Do the soft delete
                if($pond->delete()){
                    // Return a confirmation message
                    return response()->json(["msg" => "Registro eliminado satisfactoriamente"], 200);
                }
                else {
                    // In case the soft delete generate an error then return a warning message
                    return response()->json(["msg" => "No ha sido posible eliminar el registro"], 500);
                }
            }
            else {
                // If the user doesn't exist
                return response()->json(["msg" => "El estanque está siendo utilizado por una cosecha, no puede ser eliminado"], 403);
            }
        }
        else {
            // If the user doesn't exist
            return response()->json(["msg" => "El registro no existe"], 404);
        }
    }
}
