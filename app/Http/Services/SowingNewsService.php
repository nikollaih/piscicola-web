<?php

namespace App\Http\Services;

use App\Models\SowingNew;
class SowingNewsService {

    public function index($sowingId  = -1) {
        $SowingNews = new SowingNew();

        $news = $SowingNews->getAll($sowingId);
        return [
            'news' => $news,
        ];
    }

}