<?php

namespace App\Exports\Sheets;

use App\Models\SupplyUse;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class SuppliesSowingSheet implements FromQuery, ShouldAutoSize, WithTitle, WithHeadings
{
    public function __construct(int $sowingId, object $supplyUse)
    {
        $this->supply = $supplyUse;
        $this->sowingId = $sowingId;
    }
    /**
     * @inheritDoc
     */
    public function query()
    {
        $SupplyUse = new SupplyUse();
        return $SupplyUse->GetBySowingSuply($this->sowingId, $this->supply->supply_id);
    }

    public function headings(): array
    {
        return ["Cantidad", "Costo unitario", "Costo toal", "Biomasa", "Fecha de suministro"];
    }

    public function title(): string
    {
        return $this->supply->supply->name;
    }
}
