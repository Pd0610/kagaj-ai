<?php

namespace Tests\Feature;

use App\Models\Template;
use App\Models\TemplateVersion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TemplateTest extends TestCase
{
    use RefreshDatabase;

    // ── List Templates ─────────────────────────────────────

    public function test_authenticated_user_can_list_templates(): void
    {
        $user = User::factory()->create();
        $template = Template::factory()->create(['name' => 'Board Resolution']);
        TemplateVersion::factory()->published()->create(['template_id' => $template->id]);

        $response = $this->actingAs($user)->getJson('/api/v1/templates');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Board Resolution');
    }

    public function test_inactive_templates_are_excluded(): void
    {
        $user = User::factory()->create();
        Template::factory()->create(['is_active' => true]);
        Template::factory()->inactive()->create();

        $response = $this->actingAs($user)->getJson('/api/v1/templates');

        $response->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_templates_include_latest_schema(): void
    {
        $user = User::factory()->create();
        $template = Template::factory()->create();
        TemplateVersion::factory()->published()->create([
            'template_id' => $template->id,
            'version' => 1,
            'schema' => ['slots' => [['name' => 'test_field', 'type' => 'text', 'label' => 'Test', 'label_ne' => 'परीक्षण', 'required' => true]]],
        ]);

        $response = $this->actingAs($user)->getJson('/api/v1/templates');

        $response->assertOk()
            ->assertJsonPath('data.0.latest_schema.slots.0.name', 'test_field');
    }

    // ── Show Template ──────────────────────────────────────

    public function test_authenticated_user_can_view_template(): void
    {
        $user = User::factory()->create();
        $template = Template::factory()->create(['name' => 'Tax Clearance']);
        TemplateVersion::factory()->published()->create([
            'template_id' => $template->id,
            'schema' => ['slots' => [['name' => 'pan_number', 'type' => 'text', 'label' => 'PAN', 'label_ne' => 'स्थायी लेखा नम्बर', 'required' => true]]],
        ]);

        $response = $this->actingAs($user)->getJson("/api/v1/templates/{$template->id}");

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Tax Clearance')
            ->assertJsonPath('data.latest_schema.slots.0.name', 'pan_number');
    }

    // ── Premium / Tier Logic ───────────────────────────────

    public function test_premium_templates_show_as_locked_for_free_users(): void
    {
        $user = User::factory()->create(); // free plan by default
        $template = Template::factory()->premium()->create();
        TemplateVersion::factory()->published()->create(['template_id' => $template->id]);

        $response = $this->actingAs($user)->getJson('/api/v1/templates');

        $response->assertOk()
            ->assertJsonPath('data.0.is_premium', true)
            ->assertJsonPath('data.0.is_locked', true);
    }

    public function test_premium_templates_show_as_unlocked_for_pro_users(): void
    {
        $user = User::factory()->pro()->create();
        $template = Template::factory()->premium()->create();
        TemplateVersion::factory()->published()->create(['template_id' => $template->id]);

        $response = $this->actingAs($user)->getJson('/api/v1/templates');

        $response->assertOk()
            ->assertJsonPath('data.0.is_premium', true)
            ->assertJsonPath('data.0.is_locked', false);
    }

    public function test_free_templates_show_as_unlocked_for_free_users(): void
    {
        $user = User::factory()->create();
        $template = Template::factory()->create(['is_premium' => false]);
        TemplateVersion::factory()->published()->create(['template_id' => $template->id]);

        $response = $this->actingAs($user)->getJson('/api/v1/templates');

        $response->assertOk()
            ->assertJsonPath('data.0.is_locked', false);
    }

    public function test_show_includes_lock_status_for_premium(): void
    {
        $user = User::factory()->create(); // free plan
        $template = Template::factory()->premium()->create();
        TemplateVersion::factory()->published()->create(['template_id' => $template->id]);

        $response = $this->actingAs($user)->getJson("/api/v1/templates/{$template->id}");

        $response->assertOk()
            ->assertJsonPath('data.is_locked', true);
    }

    // ── Auth ───────────────────────────────────────────────

    public function test_unauthenticated_access_returns_401(): void
    {
        $response = $this->getJson('/api/v1/templates');

        $response->assertStatus(401);
    }

    public function test_unauthenticated_show_returns_401(): void
    {
        $template = Template::factory()->create();

        $response = $this->getJson("/api/v1/templates/{$template->id}");

        $response->assertStatus(401);
    }
}
