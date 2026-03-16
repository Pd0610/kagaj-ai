<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Document;
use App\Models\Template;
use App\Models\TemplateVersion;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
{
    /** @return array<string, mixed> */
    public function definition(): array
    {
        $template = Template::factory()->create();
        $version = TemplateVersion::factory()->published()->create(['template_id' => $template->id]);

        return [
            'user_id' => User::factory(),
            'company_id' => null,
            'template_id' => $template->id,
            'template_version_id' => $version->id,
            'title' => $template->name.' - '.now()->format('Y-m-d'),
            'reference_number' => 'KAG-'.now()->format('Y').'-'.str_pad((string) fake()->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT),
            'slot_data' => ['company_name' => fake()->company()],
            'pdf_path' => null,
        ];
    }

    public function withCompany(): static
    {
        return $this->state(fn (array $attributes) => [
            'company_id' => Company::factory(),
        ]);
    }
}
