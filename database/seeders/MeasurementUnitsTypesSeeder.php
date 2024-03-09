<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MeasurementUnitsTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['id' => 1, 'name' => 'Longitud'],
            ['id' => 2, 'name' => 'Cantidad'],
            ['id' => 3, 'name' => 'Volumen']
            // Add more cities as needed
        ];

        DB::table('measurement_units_types')->delete();
        DB::table('measurement_units_types')->insert($data);
    }
}
