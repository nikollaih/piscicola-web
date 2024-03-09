<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FishSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['id' => 1, 'name' => 'Mojarra'],
            ['id' => 2, 'name' => 'Trucha']
            // Add more cities as needed
        ];

        DB::table('fish')->delete();
        DB::table('fish')->insert($data);
    }
}
