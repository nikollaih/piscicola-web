<?php
   
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Http\Services\ReportsService;

class ReportsController extends BaseController
{
    public function __construct(private ReportsService $reportsService  ){}
    
    public function index()
    {
        try {
            $info = $this->reportsService->index();
            return $this->sendResponse($info, 'Datos del index obtenidos con éxito');
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function biomasses($sowingId)
    {
        try {
            return $this->reportsService->biomasses($sowingId);
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    
    public function readingsBiomasse($biomasseId) {
        try {
            return $this->reportsService->readingsBiomasse($biomasseId);
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
    public function sowingSupplies($sowingId = null, $useType = 'ALIMENT'){
        try {
            return $this->reportsService->sowingSupplies($sowingId,$useType);
            
        } catch (\Throwable $th) {
            return $this->sendError($th->getMessage());
        }
    }
}
