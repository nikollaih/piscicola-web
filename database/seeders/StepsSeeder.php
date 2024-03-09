<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StepsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['id' => 1, 'name' => 'Alevinaje'],
            ['id' => 2, 'name' => 'Levante'],
            ['id' => 3, 'name' => 'Ceba']
            // Add more cities as needed
        ];

        DB::table('steps')->delete();
        DB::table('steps')->insert($data);
    }
}
