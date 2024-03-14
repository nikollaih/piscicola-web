<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            'document' => '1',
            'productive_unit_id' => 1,
            'name' => 'Admin',
            'email' => 'admin@piscicola.com',
            'email_verified_at' => now(),
            'role_id' => 1,
            'password' => Hash::make('admin'),
            'remember_token' => Str::random(10),
        ];

        DB::table('users')->delete();
        DB::table('users')->insert($data);
    }
}
