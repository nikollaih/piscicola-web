<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class PartyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'document' => fake()->numberBetween(1000000, 1100000000),
            'productive_unit_id' => 1,
            'name' => fake()->name(),
            'mobile_phone' => fake()->phoneNumber(),
            'email' => fake()->email(),
            'party_role_id' => rand(1, 3)
        ];
    }
}
