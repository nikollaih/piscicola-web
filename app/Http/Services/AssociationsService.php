<?php

namespace App\Http\Services;

use App\Models\Association;
use App\Http\Requests\AssociationCreateRequest;

class AssociationsService {


    public function index(){
        $Association = new Association();
        return $Association->getAll();

    }
    public function store(AssociationCreateRequest $request){
        $associationRequest = $request->all();
        $association = Association::create($associationRequest);
        return Association::findOrFail($association->id);
    }
    public function getAssociation($associationId = -1){
        return  Association::findOrFail($associationId);
    }

    public function update(AssociationCreateRequest $request, $associationId = -1){
        $associationRequest = $request->all();
        Association::where('id', $associationId)->update($associationRequest);
    }

    public function destroy($associationId = -1){
        // Get the association the user is trying to delete
        $association = Association::find($associationId);

        // If the user exists
        if($association){
            // Do the soft delete
            if($association->delete()){
                // Return a confirmation message
                return ["msg" => "Registro eliminado satisfactoriamente", "status" => true];
            }
            else {
                // In case the soft delete generate an error then return a warning message
                return ["msg" => "No ha sido posible eliminar el registro", "status" => false];
            }
        }
        else {
            // If the user doesn't exist
            return ["msg" => "El registro no existe", "status" => false];
        }

    }
}
