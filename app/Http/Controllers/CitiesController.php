<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\Request;

class CitiesController extends Controller
{
    public function getCities(Request $request, $stateId)
    {
        // Validate the stateId or handle any validation logic if necessary

        // Retrieve cities by stateId
        $cities = City::where('state_id', $stateId)->get();

        // Return the cities as JSON response
        return response()->json(['cities' => $cities]);
    }
}
