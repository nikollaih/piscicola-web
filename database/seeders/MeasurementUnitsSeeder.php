<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MeasurementUnitsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $status = [
            ['id' => 1, 'name' => 'cm', 'unit_type_id' => 1],
            ['id' => 2, 'name' => 'm', 'unit_type_id' => 1],
            ['id' => 3, 'name' => 'gr', 'unit_type_id' => 2],
            ['id' => 4, 'name' => 'kg', 'unit_type_id' => 2],
            ['id' => 5, 'name' => 'litro', 'unit_type_id' => 3],
            ['id' => 6, 'name' => 'ml', 'unit_type_id' => 3],
            ['id' => 7, 'name' => 'unidad', 'unit_type_id' => 2],
            // Add more cities as needed
        ];

        DB::table('measurement_units')->delete();
        DB::table('measurement_units')->insert($status);
    }
}
