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

class ReportsController extends Controller
{
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
}
