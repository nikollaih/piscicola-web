<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PondsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['id' => 1, 'productive_unit_id' => 1, 'name' => 'Estanque 1', 'capacity' => 5000],
            ['id' => 2, 'productive_unit_id' => 1, 'name' => 'Estanque 2', 'capacity' => 7000],
            // Add more cities as needed
        ];

        DB::table('ponds')->delete();
        DB::table('ponds')->insert($data);
    }
}
