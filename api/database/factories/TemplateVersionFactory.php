<?php

namespace Database\Factories;

use App\Models\Template;
use App\Models\TemplateVersion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TemplateVersion>
 */
class TemplateVersionFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'template_id' => Template::factory(),
            'version' => 1,
            'schema' => [
                'slots' => [
                    [
                        'name' => 'company_name',
                        'type' => 'text',
                        'label' => 'Company Name',
                        'label_ne' => 'कम्पनीको नाम',
                        'required' => true,
                        'source' => 'company',
                    ],
                ],
            ],
            'blade_template' => '<h1>{{ $company_name }}</h1>',
            'published_at' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => now(),
        ]);
    }
}
