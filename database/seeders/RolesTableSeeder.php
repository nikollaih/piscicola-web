<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample states data
        $roles = [
            [
                'id' => 1,
                'name' => 'Admin',
                'rol' => 'admin'
            ],
            [
                'id' => 2,
                'name' => 'Manager',
                'rol' => 'manager'
            ],
            [
                'id' => 3,
                'name' => 'Asistente',
                'rol' => 'assistant'
            ]
            // Add more states as needed
        ];

        DB::table('roles')->delete();
        // Insert data into the 'states' table
        DB::table('roles')->insert($roles);
    }
}
