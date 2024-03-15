<?php

namespace App\Exports;

use App\Exports\Sheets\ReadingsBiomasseSheet;
use App\Models\StatsReading;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ReadingsBiomasseExport implements WithMultipleSheets
{
    private ?int $biomasseId;

    public function __construct(int $biomasseId = null)
    {
        $this->biomasseId = $biomasseId;
    }
    /**
    * @return \Illuminate\Support\Collection
    */
    public function sheets(): array
    {
        $sheets = [];
        $StatsReading = new StatsReading();
        $latestByBiomasse = $StatsReading->latestByBiomasse($this->biomasseId);

        if($latestByBiomasse){
            foreach ($latestByBiomasse as $reading) {
                $sheets[] = new ReadingsBiomasseSheet($this->biomasseId, $reading);
            }
        }

        return $sheets;
    }
}
