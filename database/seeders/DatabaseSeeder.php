<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Association;
use App\Models\ProductiveUnit;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call the RolesTableSeeder
        $this->call(RolesTableSeeder::class);
        $this->call(FishSeeder::class);
        $this->call(StepsSeeder::class);
        $this->call(StepStatSeeder::class);
        $this->call(MeasurementUnitsTypesSeeder::class);
        $this->call(MeasurementUnitsSeeder::class);

        Association::factory(1)->create();
        ProductiveUnit::factory(3)->create();
        User::factory(1)->create();

        $this->call(PondsSeeder::class);
    }
}
