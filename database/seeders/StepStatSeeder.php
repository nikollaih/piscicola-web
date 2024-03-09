<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StepStatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'id' => 1,
                'name' => 'Temperatura',
                'step_id' => 1,
                'key' => 'temperatura',
                'value_minimun' => 25,
                'value_maximun' => 30
            ],
            [
                'id' => 2,
                'name' => 'Ph',
                'step_id' => 1,
                'key' => 'ph',
                'value_minimun' => 6.5,
                'value_maximun' => 8
            ],
            [
                'id' => 3,
                'name' => 'Oxigeno',
                'step_id' => 1,
                'key' => 'oxigeno',
                'value_minimun' => 6,
                'value_maximun' => 7
            ],
            [
                'id' => 4,
                'name' => 'Nitritos',
                'step_id' => 1,
                'key' => 'nitritos',
                'value_minimun' => 0.6,
                'value_maximun' => 2
            ],
            [
                'id' => 5,
                'name' => 'Temperatura',
                'step_id' => 2,
                'key' => 'temperatura',
                'value_minimun' => 25,
                'value_maximun' => 30
            ],
            [
                'id' => 6,
                'name' => 'Ph',
                'step_id' => 2,
                'key' => 'ph',
                'value_minimun' => 6.5,
                'value_maximun' => 8
            ],
            [
                'id' => 7,
                'name' => 'Oxigeno',
                'step_id' => 2,
                'key' => 'oxigeno',
                'value_minimun' => 6,
                'value_maximun' => 7
            ],
            [
                'id' => 8,
                'name' => 'Nitritos',
                'step_id' => 2,
                'key' => 'nitritos',
                'value_minimun' => 0.6,
                'value_maximun' => 2
            ],
            [
                'id' => 9,
                'name' => 'Temperatura',
                'step_id' => 3,
                'key' => 'temperatura',
                'value_minimun' => 25,
                'value_maximun' => 30
            ],
            [
                'id' => 10,
                'name' => 'Ph',
                'step_id' => 3,
                'key' => 'ph',
                'value_minimun' => 6.5,
                'value_maximun' => 8
            ],
            [
                'id' => 11,
                'name' => 'Oxigeno',
                'step_id' => 3,
                'key' => 'oxigeno',
                'value_minimun' => 6,
                'value_maximun' => 7
            ],
            [
                'id' => 12,
                'name' => 'Nitritos',
                'step_id' => 3,
                'key' => 'nitritos',
                'value_minimun' => 0.6,
                'value_maximun' => 2
            ],
            // Add more cities as needed
        ];

        DB::table('step_stats')->delete();
        DB::table('step_stats')->insert($data);
    }
}
