<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExpenseCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['name' => 'Electricidad'],
            ['name' => 'Gas'],
            ['name' => 'Agua'],
            ['name' => 'Teléfono'],
            ['name' => 'Internet'],
            ['name' => 'Reparaciones'],
            ['name' => 'Transporte'],
            ['name' => 'Combustible'],
            ['name' => 'Alimentación'],
            ['name' => 'Seguro'],
            ['name' => 'Materiales'],
            ['name' => 'Aseo'],
            ['name' => 'Suministros'],
            // Add more cities as needed
        ];

        DB::table('expense_categories')->delete();
        DB::table('expense_categories')->insert($data);
    }
}
