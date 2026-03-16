<?php

namespace Database\Factories;

use App\Enums\TemplateCategory;
use App\Models\Template;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Template>
 */
class TemplateFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(3),
            'name_ne' => null,
            'category' => fake()->randomElement(TemplateCategory::cases()),
            'description' => fake()->sentence(),
            'description_ne' => null,
            'is_premium' => false,
            'is_active' => true,
        ];
    }

    public function premium(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_premium' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
