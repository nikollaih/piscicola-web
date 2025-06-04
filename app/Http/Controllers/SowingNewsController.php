<?php

namespace App\Http\Controllers;

use App\Models\SowingNew;
use Illuminate\Http\Request;
use App\Models\Sowing;

class SowingNewsController extends Controller
{
    public function index($sowingId) {
        $SowingNews = new SowingNew();
        $Sowing = new Sowing();
        $Sowing->setSowingId($sowingId);
        $sowing = $Sowing->Get();

        $news = $SowingNews->getAll($sowingId);
        return \inertia('SowingNews/Index', [
            'sowing' => $sowing,
            'news' => $news,
            'baseUrl' => url('/'),
            'csrfToken' => csrf_token()
        ]);
    }
}
