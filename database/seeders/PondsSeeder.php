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
            [
                'id' => 1,
                'productive_unit_id' => 2,
                'name' => 'Estanque 1',
                'area' => 200,
                'volume' => 150,
                'entrance' => 20,
                'exit' => 20,
                'covered' => 2
            ],
            [
                'id' => 2,
                'productive_unit_id' => 2,
                'name' => 'Estanque 2',
                'area' => 150,
                'volume' => 100,
                'entrance' => 12,
                'exit' => 12,
                'covered' => 1
            ],
            // Add more cities as needed
        ];

        DB::table('ponds')->delete();
        DB::table('ponds')->insert($data);
    }
}
