<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PartiesRolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['id' => 1, 'name' => 'Cliente'],
            ['id' => 2, 'name' => 'Empleado'],
            ['id' => 3, 'name' => 'Proveedor']
            // Add more cities as needed
        ];

        DB::table('parties_rol')->delete();
        DB::table('parties_rol')->insert($data);
    }
}
