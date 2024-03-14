<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class AssociationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => 2,
            'name' => 'Asopifil',
            'email' => fake()->email(),
            'mobile_phone' => fake()->phoneNumber(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address()
        ];
    }
}
