<?php

namespace Tests\Feature;

use App\Contracts\PdfGenerator;
use App\Enums\Plan;
use App\Models\Company;
use App\Models\Document;
use App\Models\Template;
use App\Models\TemplateVersion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FakePdfGenerator implements PdfGenerator
{
    public function generate(string $html, string $outputPath): void
    {
        $dir = dirname($outputPath);
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents($outputPath, '%PDF-1.4 fake');
    }
}

class DocumentTest extends TestCase
{
    use RefreshDatabase;

    private Template $template;

    private TemplateVersion $version;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->bind(PdfGenerator::class, FakePdfGenerator::class);

        $this->template = Template::factory()->create();
        $this->version = TemplateVersion::factory()->published()->create([
            'template_id' => $this->template->id,
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
                    [
                        'name' => 'resolution_date',
                        'type' => 'date',
                        'label' => 'Resolution Date',
                        'label_ne' => 'प्रस्ताव मिति',
                        'required' => true,
                    ],
                ],
            ],
            'blade_template' => '<h1>{{ $company_name }}</h1><p>Date: {{ $resolution_date }}</p>',
        ]);
    }

    // ── Store (Happy Path) ──────────────────────────────────

    public function test_user_can_generate_document(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/documents', [
            'template_id' => $this->template->id,
            'slot_data' => [
                'company_name' => 'Test Corp',
                'resolution_date' => '2026-03-16',
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.has_pdf', true)
            ->assertJsonStructure([
                'data' => ['id', 'title', 'reference_number', 'template_id', 'template_version_id', 'company_id', 'slot_data', 'has_pdf', 'created_at', 'updated_at'],
            ]);

        $this->assertDatabaseHas('documents', [
            'user_id' => $user->id,
            'template_id' => $this->template->id,
        ]);
    }

    public function test_generate_requires_auth(): void
    {
        $response = $this->postJson('/api/v1/documents', [
            'template_id' => $this->template->id,
            'slot_data' => [
                'company_name' => 'Test Corp',
                'resolution_date' => '2026-03-16',
            ],
        ]);

        $response->assertStatus(401);
    }

    public function test_generate_requires_valid_template(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/documents', [
            'template_id' => '00000000-0000-0000-0000-000000000000',
            'slot_data' => ['company_name' => 'Test'],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['template_id']);
    }

    public function test_generate_validates_required_slots(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/documents', [
            'template_id' => $this->template->id,
            'slot_data' => [
                'company_name' => 'Test Corp',
                // resolution_date is required but missing
            ],
        ]);

        $response->assertStatus(422);
    }

    public function test_generate_with_company_auto_fills(): void
    {
        $user = User::factory()->create();
        $company = Company::factory()->create([
            'user_id' => $user->id,
            'name' => 'AutoFill Corp',
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/documents', [
            'template_id' => $this->template->id,
            'company_id' => $company->id,
            'slot_data' => [
                'resolution_date' => '2026-03-16',
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        // Verify company name was auto-filled into slot_data
        $document = Document::first();
        $this->assertNotNull($document);
        $this->assertEquals('AutoFill Corp', $document->slot_data['company_name']);
    }

    // ── Tier Limits ─────────────────────────────────────────

    public function test_free_user_limited_to_5_docs_per_month(): void
    {
        $user = User::factory()->create(['plan' => Plan::Free]);

        // Create 5 documents this month
        for ($i = 0; $i < 5; $i++) {
            Document::factory()->create([
                'user_id' => $user->id,
                'created_at' => now(),
            ]);
        }

        $response = $this->actingAs($user)->postJson('/api/v1/documents', [
            'template_id' => $this->template->id,
            'slot_data' => [
                'company_name' => 'Test Corp',
                'resolution_date' => '2026-03-16',
            ],
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('success', false);
    }

    public function test_free_user_cannot_use_premium_template(): void
    {
        $user = User::factory()->create(['plan' => Plan::Free]);
        $premiumTemplate = Template::factory()->premium()->create();
        TemplateVersion::factory()->published()->create([
            'template_id' => $premiumTemplate->id,
        ]);

        $response = $this->actingAs($user)->postJson('/api/v1/documents', [
            'template_id' => $premiumTemplate->id,
            'slot_data' => [
                'company_name' => 'Test Corp',
            ],
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('success', false);
    }

    // ── Index ───────────────────────────────────────────────

    public function test_user_can_list_own_documents(): void
    {
        $user = User::factory()->create();
        Document::factory()->count(3)->create(['user_id' => $user->id]);

        // Another user's document — should NOT appear
        Document::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/v1/documents');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(3, 'data');
    }

    // ── Show ────────────────────────────────────────────────

    public function test_user_cannot_view_another_users_document(): void
    {
        $user = User::factory()->create();
        $otherDoc = Document::factory()->create();

        $response = $this->actingAs($user)->getJson("/api/v1/documents/{$otherDoc->id}");

        $response->assertStatus(403);
    }

    // ── Download ────────────────────────────────────────────

    public function test_user_can_download_own_document(): void
    {
        $user = User::factory()->create();

        // Generate a real document through the API
        $response = $this->actingAs($user)->postJson('/api/v1/documents', [
            'template_id' => $this->template->id,
            'slot_data' => [
                'company_name' => 'Download Corp',
                'resolution_date' => '2026-03-16',
            ],
        ]);

        $response->assertStatus(201);
        $docId = $response->json('data.id');

        $downloadResponse = $this->actingAs($user)->get("/api/v1/documents/{$docId}/download");

        $downloadResponse->assertOk()
            ->assertHeader('Content-Type', 'application/pdf');
    }

    // ── Quick Generate (no company) ─────────────────────────

    public function test_generate_without_company_allowed(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/documents', [
            'template_id' => $this->template->id,
            'slot_data' => [
                'company_name' => 'Manual Corp',
                'resolution_date' => '2026-03-16',
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.company_id', null);
    }
}
