<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\SowingNewsService;

class SowingNewsController extends BaseController
{
    public function __construct(private SowingNewsService $sowingNewsService  ){}

    
    public function index($sowingId)
    {
        try {
            $indexInfo = $this->sowingNewsService->index($sowingId);
            return $this->sendResponse($indexInfo, 'Datos del index obtenidos con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    
}
