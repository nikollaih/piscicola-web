<?php

namespace App\Exports;

use App\Exports\Sheets\ReadingsBiomasseSheet;
use App\Exports\Sheets\SuppliesSowingSheet;
use App\Models\StatsReading;
use App\Models\SupplyUse;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class SuppliesSowingExport implements WithMultipleSheets
{
    private ?int $biomasseId;

    public function __construct(int $sowingId = null, string $type = "ALIMENT")
{
    $this->sowingId = $sowingId;
    $this->type = $type;
}
    /**
     * @return \Illuminate\Support\Collection
     */
    public function sheets(): array
{
    $sheets = [];
    $SupplyUse = new SupplyUse();
    $supplies = $SupplyUse->getDifferentBySowing($this->sowingId, $this->type);

    if($supplies){
        foreach ($supplies as $supplyUse) {
            $sheets[] = new SuppliesSowingSheet($this->sowingId, $supplyUse);
        }
    }

    return $sheets;
}
}
