<?php

namespace App\Http\Controllers;

use App\Http\Requests\SupplyUseCreateRequest;
use Illuminate\Http\Request;

class StatReadingsController extends Controller
{
    public function index (SupplyUseCreateRequest $request) {
        dd($request);
    }
}
