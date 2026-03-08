<?php

namespace Database\Factories;

use App\Enums\DocumentStatus;
use App\Enums\Language;
use App\Models\Template;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document> */
class DocumentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'template_id' => Template::factory(),
            'template_version' => 1,
            'title' => fake()->sentence(4),
            'status' => DocumentStatus::Draft,
            'slot_data' => [],
            'language' => Language::English,
            'is_watermarked' => true,
        ];
    }

    public function completed(): static
    {
        return $this->state(fn () => ['status' => DocumentStatus::Completed]);
    }
}
