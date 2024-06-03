<?php

namespace App\Http\Services;

use App\Models\Sowing;
use App\Models\Biomasse;
use App\Models\StatsReading;
use App\Models\SupplyUse;
use App\Exports\BiomassesExport;
use App\Exports\ReadingsBiomasseExport;
use App\Exports\SuppliesSowingExport;
use Maatwebsite\Excel\Facades\Excel;

class ReportsService {

    public function index(){
        $Sowing = new Sowing();
        $sowings = $Sowing->getAll();
        return [
            'sowings' => $sowings
        ];
    }
    public function biomasses($sowingId = null){
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
        return null;
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
            return null;
        }
    }
    public function getReadingsBetweenDatesGroupedByStepStats($sowingId,$fromDate,$toDate){
        $readings =  StatsReading::getReadingsBetweenDates($sowingId,$fromDate,$toDate);;
        return $readingsGroupedByStepStat = $this->groupReadingsByStepStat($readings);
    }

    //metodo que agrupa las lecturas por medio de su unidad de medida
    public function groupReadingsByStepStat($readings = []){
        $groupedReadings = [];

        foreach ($readings as $reading) {
            $measurementUnit = $reading->measurementUnit;
    
            if (!array_key_exists($measurementUnit, $groupedReadings)) {
                $groupedReadings[$measurementUnit] = [];
            }
    
            $groupedReadings[$measurementUnit][] = $reading;
        }
        return $groupedReadings;
    }
}