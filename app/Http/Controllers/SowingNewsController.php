<?php

namespace App\Http\Controllers;

use App\Models\SowingNew;
use Illuminate\Http\Request;
use App\Models\Sowing;

class SowingNewsController extends Controller
{
    public function index(Request $request, $sowingId) {
        $SowingNews = new SowingNew();
        $Sowing = new Sowing();
        $Sowing->setSowingId($sowingId);
        $sowing = $Sowing->Get();

        $type = $request->query('type'); // <- aquí obtienes el parámetro `type` si existe

        $news = $SowingNews->getAll($sowingId, $type); // <-- pásalo para que filtre
        return \inertia('SowingNews/Index', [
            'sowing' => $sowing,
            'news' => $news,
            'baseUrl' => url('/'),
            'csrfToken' => csrf_token()
        ]);
    }
}
