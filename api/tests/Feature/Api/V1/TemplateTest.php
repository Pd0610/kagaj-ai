<?php

namespace Tests\Feature\Api\V1;

use App\Models\Template;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TemplateTest extends TestCase
{
    use RefreshDatabase;

    private function seedTemplates(): void
    {
        Template::factory()->create([
            'slug' => 'board-meeting-minute',
            'name_en' => 'Board Meeting Minute',
            'name_ne' => 'सञ्चालक समिति बैठक मिनेट',
            'category' => 'ocr',
            'is_published' => true,
            'price' => 0,
            'sort_order' => 1,
        ]);

        Template::factory()->create([
            'slug' => 'house-rental-agreement',
            'name_en' => 'House Rental Agreement',
            'name_ne' => 'घर भाडा सम्झौता',
            'category' => 'rental',
            'is_published' => true,
            'price' => 100,
            'sort_order' => 2,
        ]);

        Template::factory()->create([
            'slug' => 'draft-template',
            'name_en' => 'Draft Template',
            'name_ne' => 'ड्राफ्ट',
            'category' => 'ocr',
            'is_published' => false,
            'sort_order' => 3,
        ]);
    }

    // --- Index ---

    public function test_index_returns_published_templates(): void
    {
        $this->seedTemplates();

        $response = $this->getJson('/api/v1/templates');

        $response->assertOk()
            ->assertJson(['success' => true])
            ->assertJsonCount(2, 'data')
            ->assertJsonStructure([
                'success',
                'data' => [['slug', 'name', 'name_ne', 'category', 'price', 'is_free_eligible']],
                'meta' => ['current_page', 'per_page', 'total', 'last_page'],
            ]);
    }

    public function test_index_excludes_unpublished(): void
    {
        $this->seedTemplates();

        $response = $this->getJson('/api/v1/templates');

        $slugs = collect($response->json('data'))->pluck('slug')->all();
        $this->assertNotContains('draft-template', $slugs);
    }

    public function test_index_filters_by_category(): void
    {
        $this->seedTemplates();

        $response = $this->getJson('/api/v1/templates?category=ocr');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'board-meeting-minute');
    }

    public function test_index_searches_by_name(): void
    {
        $this->seedTemplates();

        $response = $this->getJson('/api/v1/templates?search=rental');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'house-rental-agreement');
    }

    public function test_index_respects_pagination(): void
    {
        $this->seedTemplates();

        $response = $this->getJson('/api/v1/templates?per_page=1&page=1');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonPath('meta.total', 2);
    }

    public function test_index_caps_per_page_at_50(): void
    {
        $this->seedTemplates();

        $response = $this->getJson('/api/v1/templates?per_page=100');

        $response->assertOk()
            ->assertJsonPath('meta.per_page', 50);
    }

    public function test_index_does_not_include_schema(): void
    {
        $this->seedTemplates();

        $response = $this->getJson('/api/v1/templates');

        $this->assertArrayNotHasKey('schema', $response->json('data.0'));
    }

    // --- Categories ---

    public function test_categories_returns_counts(): void
    {
        $this->seedTemplates();

        $response = $this->getJson('/api/v1/templates/categories');

        $response->assertOk()
            ->assertJson(['success' => true]);

        $categories = collect($response->json('data'));
        $ocr = $categories->firstWhere('slug', 'ocr');
        $rental = $categories->firstWhere('slug', 'rental');

        $this->assertNotNull($ocr);
        $this->assertEquals(1, $ocr['templates_count']);
        $this->assertNotNull($rental);
        $this->assertEquals(1, $rental['templates_count']);
    }

    public function test_categories_excludes_unpublished(): void
    {
        $this->seedTemplates();

        $response = $this->getJson('/api/v1/templates/categories');

        $categories = collect($response->json('data'));
        $ocr = $categories->firstWhere('slug', 'ocr');

        // Only 1 published OCR template (draft is excluded)
        $this->assertEquals(1, $ocr['templates_count']);
    }

    // --- Show ---

    public function test_show_returns_template_with_schema(): void
    {
        $this->seedTemplates();

        $response = $this->getJson('/api/v1/templates/board-meeting-minute');

        $response->assertOk()
            ->assertJson(['success' => true])
            ->assertJsonPath('data.slug', 'board-meeting-minute')
            ->assertJsonStructure([
                'data' => ['slug', 'name', 'name_ne', 'category', 'price', 'version', 'schema'],
            ]);
    }

    public function test_show_returns_404_for_unpublished(): void
    {
        $this->seedTemplates();

        $response = $this->getJson('/api/v1/templates/draft-template');

        $response->assertNotFound();
    }

    public function test_show_returns_404_for_nonexistent(): void
    {
        $response = $this->getJson('/api/v1/templates/does-not-exist');

        $response->assertNotFound();
    }
}
