<?php

namespace App\Exports;

use App\Models\Biomasse;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class BiomassesExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    public function __construct(int $sowingId = null)
    {
        $this->sowingId = $sowingId;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Biomasse::select("approximate_weight", "quantity_of_fish", "manual_created_at")->with('Sowing')->where('sowing_id', $this->sowingId)->get();
    }

    /**
     * Write code on Method
     *
     * @return response()
     */
    public function headings(): array
    {
        return ["Peso aproximado (gr)", "Cantidad de peces para la muestra", "Fecha"];
    }
}
