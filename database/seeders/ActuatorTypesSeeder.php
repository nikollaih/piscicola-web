<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ActuatorTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['id' => 1, 'name' => 'Batería'],
            ['id' => 2, 'name' => 'Motobomba'],
            ['id' => 3, 'name' => 'Oxigenador'],
            // Add more cities as needed
        ];

        DB::table('actuator_types')->delete();
        DB::table('actuator_types')->insert($data);
    }
}
