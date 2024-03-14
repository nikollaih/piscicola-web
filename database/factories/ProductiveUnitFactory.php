<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class ProductiveUnitFactory extends Factory
{

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'association_id' => 2,
            'name' => fake()->company(),
            'email' => fake()->email(),
            'mobile_phone' => fake()->phoneNumber(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address()
        ];
    }
}
