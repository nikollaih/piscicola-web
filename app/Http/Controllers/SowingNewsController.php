<?php

namespace App\Http\Controllers;

use App\Models\SowingNew;
use Illuminate\Http\Request;

class SowingNewsController extends Controller
{
    public function index($sowingId) {
        $SowingNews = new SowingNew();

        $news = $SowingNews->getAll($sowingId);
        return \inertia('SowingNews/Index', [
            'news' => $news,
            'baseUrl' => url('/'),
            'csrfToken' => csrf_token()
        ]);
    }
}
