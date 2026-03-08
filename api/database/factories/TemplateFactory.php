<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Template> */
class TemplateFactory extends Factory
{
    public function definition(): array
    {
        return [
            'slug' => fake()->unique()->slug(3),
            'name_en' => fake()->sentence(3),
            'name_ne' => 'नमूना टेम्प्लेट',
            'category' => fake()->randomElement(['ocr', 'tax', 'rental', 'employment']),
            'description_en' => fake()->paragraph(),
            'description_ne' => null,
            'schema' => ['slots' => []],
            'html_body' => '<div>{{ $slot_data }}</div>',
            'version' => 1,
            'is_published' => true,
            'price' => 0,
            'sort_order' => 0,
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => ['is_published' => true]);
    }

    public function draft(): static
    {
        return $this->state(fn () => ['is_published' => false]);
    }
}
