<?php

namespace App\Http\Controllers;

use App\Exports\BiomassesExport;
use App\Exports\ReadingsBiomasseExport;
use App\Exports\SuppliesSowingExport;
use App\Models\Biomasse;
use App\Models\Sowing;
use App\Models\StatsReading;
use App\Models\SupplyUse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;
use App\Http\Services\ReportsService;
use App\Http\Services\SowingsService;
use Illuminate\Support\Facades\Auth;

class ReportsController extends Controller
{

    //metodo que inicializa los servicios del controlador
    public function __construct(
        private ReportsService $reportsService,
        private SowingsService $sowingsService
        ){}

    public function index() {
        $Sowing = new Sowing();
        $sowings = $Sowing->getAll();

        return \inertia('Reports/Index', [
            'sowings' => $sowings,
            'csrfToken' => csrf_token()
        ]);
    }

    public function biomasses($sowingId = null)
    {
        $sowing = Sowing::find($sowingId);
        $fileName = $sowing->name . ' - Reporte de biomasas.xlsx';
        return Excel::download(new BiomassesExport($sowingId), $fileName);
    }

    public function readingsBiomasse($biomasseId) {
        $Biomasse = new Biomasse();
        $biomasse = $Biomasse->Get($biomasseId);
        $StatsReading = new StatsReading();
        $latestByBiomasse = $StatsReading->latestByBiomasse($biomasseId);

        if(count($latestByBiomasse)){
            $fileName = "Lecturas " .$biomasse['approximate_weight'].'gr.xlsx';
            return Excel::download(new ReadingsBiomasseExport($biomasseId), $fileName);
        }

        // Redirige de vuelta a la página anterior
        return back();
    }

    public function sowingSupplies($sowingId = null, $useType = 'ALIMENT')
    {
        $typeTitle = (($useType == "ALIMENT") ? "alimentos" : (($useType == "MEDICINE") ? "medicamentos" : "otros suministros"));
        $SupplyUse = new SupplyUse();
        $supplies = $SupplyUse->getDifferentBySowing($sowingId, $useType);
        $sowing = Sowing::find($sowingId);

        if(count($supplies)) {
            $fileName = $sowing->name . ' - Reporte de '.$typeTitle.'.xlsx';
            return Excel::download(new SuppliesSowingExport($sowingId, $useType), $fileName);
        }
        else {
            return back();
        }
    }
    public function readingsBetweenDatesPdf($sowingId,$fromDate,$toDate){
        try {
            $requestData = ["sowingId"=>$sowingId,"fromDate"=>$fromDate,"toDate"=>$toDate];

            // validate dates
            $validator = Validator::make($requestData, [
                //expresion regular que permite el formato xxxx-xx-xx lo cual hace referencia a anio-mes-dia
                 'fromDate' => 'required|date|regex:/^\d{4}-\d{2}-\d{2}$/',
                //expresion regular que permite el formato xxxx-xx-xx lo cual hace referencia a anio-mes-dia
                 'toDate' => 'required|date|regex:/^\d{4}-\d{2}-\d{2}$/|after_or_equal:fromDate',
                 //se valida que la cosecha exista
                 'sowingId' => 'required|numeric|min:0|exists:'. Sowing::class.',id',
            ]);
            if ($validator->fails()) {
                //TODO: revisar un back() con mensaje custom de error.
                return back();
            }

            $sessionUserRole = Auth::user()->role_id;


            $sowing = null;
            if ($sessionUserRole == ADMINISTRADOR){
                $sowing = $this->sowingsService->getSowingBasicInfo($sowingId);
            }
            if($sessionUserRole == MANAGER || $sessionUserRole == ASISTENTE){
                $sowing = $this->sowingsService->getSowingBasicInfoBySessionUser($sowingId);
            }
            if($sowing == null){
                //TODO: revisar un back() con mensaje custom de error.
                return back();
            }
            $readings =  $this->reportsService->getReadingsBetweenDatesGroupedByStepStats($sowing->id,$fromDate,$toDate);
            return \inertia('Reports/ReadingsBetweenDates', [
                'sowing' => $sowing,
                'readings' => $readings,
                'fromDate' => $fromDate,
                'toDate' => $toDate,
                'csrfToken' => csrf_token()
            ]);

        } catch (\Throwable $th) {
            //TODO: revisar un back() con mensaje custom de error.
            return back();
        }
    }
}
