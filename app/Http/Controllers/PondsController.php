<?php

namespace App\Http\Controllers;

use App\Models\Pond;
use Illuminate\Http\Request;
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
            'createMortalityUrl' => route('ponds'),
            'csrfToken' => csrf_token()
        ]);
    }
}
