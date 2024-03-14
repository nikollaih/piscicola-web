<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssociationCreateRequest;
use App\Models\Association;
use Illuminate\Http\Request;

class AssociationsController extends Controller
{
    public function index() {
        $Association = new Association();
        $associations = $Association->getAll();

        return \inertia('Associations/Index', [
            'associations' => $associations,
            'csrfToken' => csrf_token()
        ]);
    }

    public function create() {
        return \inertia('Associations/Create', [
            'formActionUrl' => route('association.store'),
            'csrfToken' => csrf_token()
        ]);
    }

    public function store (AssociationCreateRequest $request) {
        $associationRequest = $request->all();
        $association = Association::create($associationRequest);

        // Api response
        if($request->is('api/*')){
            if($association){
                return response()->json(Association::find($association->id), 200);
            }
            return response()->json([], 500);
        }
    }

    public function edit($associationId) {
        $association = Association::find($associationId);

        return \inertia('Associations/Create', [
            'association' => $association,
            'formActionUrl' => route('association.update', ['associationId' => $associationId]),
            'csrfToken' => csrf_token()
        ]);
    }

    public function update(AssociationCreateRequest $request, $associationId)
    {
        $associationRequest = $request->all();
        Association::where('id', $associationId)->update($associationRequest);
    }

    public function destroy($associationId)
    {
        // Get the association the user is trying to delete
        $association = Association::find($associationId);

        // If the user exists
        if($association){
            // Do the soft delete
            if($association->delete()){
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
            return response()->json(["msg" => "El registro no existe"], 404);
        }
    }
}
