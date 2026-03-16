<?php

namespace Database\Factories;

use App\Enums\CompanyType;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Company>
 */
class CompanyFactory extends Factory
{
    /** @return array<string, mixed> */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'name_ne' => null,
            'type' => fake()->randomElement(CompanyType::cases()),
            'registration_number' => fake()->numerify('REG-######'),
            'pan_number' => fake()->numerify('#########'),
            'address' => fake()->address(),
            'user_id' => User::factory(),
        ];
    }

    public function pvtLtd(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => CompanyType::PvtLtd,
        ]);
    }
}
