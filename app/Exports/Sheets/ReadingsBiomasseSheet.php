<?php

namespace App\Exports\Sheets;

use App\Models\StatsReading;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class ReadingsBiomasseSheet implements FromQuery, WithTitle, WithHeadings, ShouldAutoSize
{
    public function __construct(int $biomasseId, object $stepStat)
    {
        $this->biomasseId = $biomasseId;
        $this->stepStat  = $stepStat;
    }

    /**
     * @inheritDoc
     */
    public function query()
    {
        $StatsReading = new StatsReading();
        return $StatsReading->GetByBiomasseStatReport($this->biomasseId, $this->stepStat->stepStat->id);
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return $this->stepStat->stepStat->name . " - " . $this->stepStat->step->name;
    }

    public function headings(): array
    {
        return ["Lectura", "Alarma", "Fecha de lectura"];
    }
}
