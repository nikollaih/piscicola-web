<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductiveUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            'id' => 1,
            'association_id' => 1,
            'name' => 'admin',
            'email' => 'admin@piscicola.com',
            'mobile_phone' => '',
            'phone' => '',
            'address' => '',
            'deleted_at' => now()
        ];

        DB::table('productive_units')->delete();
        DB::table('productive_units')->insert($data);
    }
}
