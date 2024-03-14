<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AssociationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            'id' => 1,
            'name' => 'admin',
            'email' => 'admin@piscicola.com',
            'mobile_phone' => '',
            'phone' => '',
            'address' => '',
            'deleted_at' => now()
        ];

        DB::table('associations')->delete();
        DB::table('associations')->insert($data);
    }
}
