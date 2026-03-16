<?php

namespace Tests\Feature;

use App\Enums\CompanyType;
use App\Enums\Plan;
use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyTest extends TestCase
{
    use RefreshDatabase;

    // ── Index ───────────────────────────────────────────────

    public function test_user_can_list_own_companies(): void
    {
        $user = User::factory()->create();
        Company::factory()->count(3)->create(['user_id' => $user->id]);

        // Another user's company — should NOT appear
        Company::factory()->create();

        $response = $this->actingAs($user)->getJson('/api/v1/companies');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(3, 'data');
    }

    public function test_index_requires_auth(): void
    {
        $response = $this->getJson('/api/v1/companies');

        $response->assertStatus(401);
    }

    // ── Store ───────────────────────────────────────────────

    public function test_user_can_create_company(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/companies', [
            'name' => 'Test Company Pvt. Ltd.',
            'name_ne' => 'टेस्ट कम्पनी प्रा. लि.',
            'type' => CompanyType::PvtLtd->value,
            'registration_number' => 'REG-123456',
            'pan_number' => '123456789',
            'address' => 'Kathmandu, Nepal',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Test Company Pvt. Ltd.')
            ->assertJsonPath('data.type', CompanyType::PvtLtd->value)
            ->assertJsonStructure([
                'data' => ['id', 'name', 'name_ne', 'type', 'registration_number', 'pan_number', 'address', 'created_at', 'updated_at'],
            ]);

        $this->assertDatabaseHas('companies', [
            'name' => 'Test Company Pvt. Ltd.',
            'user_id' => $user->id,
        ]);
    }

    public function test_store_requires_name_and_type(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/companies', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'type']);
    }

    public function test_store_rejects_invalid_type(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/companies', [
            'name' => 'Test Co',
            'type' => 'invalid_type',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    }

    public function test_store_requires_auth(): void
    {
        $response = $this->postJson('/api/v1/companies', [
            'name' => 'Test Co',
            'type' => CompanyType::PvtLtd->value,
        ]);

        $response->assertStatus(401);
    }

    // ── Tier Limits ─────────────────────────────────────────

    public function test_free_user_cannot_create_more_than_one_company(): void
    {
        $user = User::factory()->create(['plan' => Plan::Free]);
        Company::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->postJson('/api/v1/companies', [
            'name' => 'Second Company',
            'type' => CompanyType::PvtLtd->value,
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('success', false);

        $this->assertDatabaseCount('companies', 1);
    }

    public function test_pro_user_can_create_multiple_companies(): void
    {
        $user = User::factory()->pro()->create();
        Company::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->postJson('/api/v1/companies', [
            'name' => 'Second Company',
            'type' => CompanyType::PvtLtd->value,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseCount('companies', 2);
    }

    // ── Show ────────────────────────────────────────────────

    public function test_user_can_view_own_company(): void
    {
        $user = User::factory()->create();
        $company = Company::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson("/api/v1/companies/{$company->id}");

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.id', $company->id)
            ->assertJsonPath('data.name', $company->name);
    }

    public function test_user_cannot_view_another_users_company(): void
    {
        $user = User::factory()->create();
        $otherCompany = Company::factory()->create();

        $response = $this->actingAs($user)->getJson("/api/v1/companies/{$otherCompany->id}");

        $response->assertStatus(403);
    }

    // ── Update ──────────────────────────────────────────────

    public function test_user_can_update_own_company(): void
    {
        $user = User::factory()->create();
        $company = Company::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->putJson("/api/v1/companies/{$company->id}", [
            'name' => 'Updated Name',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Updated Name');

        $this->assertDatabaseHas('companies', [
            'id' => $company->id,
            'name' => 'Updated Name',
        ]);
    }

    public function test_user_cannot_update_another_users_company(): void
    {
        $user = User::factory()->create();
        $otherCompany = Company::factory()->create();

        $response = $this->actingAs($user)->putJson("/api/v1/companies/{$otherCompany->id}", [
            'name' => 'Hacked Name',
        ]);

        $response->assertStatus(403);
    }

    // ── Delete ──────────────────────────────────────────────

    public function test_user_can_delete_own_company(): void
    {
        $user = User::factory()->create();
        $company = Company::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->deleteJson("/api/v1/companies/{$company->id}");

        $response->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('companies', ['id' => $company->id]);
    }

    public function test_user_cannot_delete_another_users_company(): void
    {
        $user = User::factory()->create();
        $otherCompany = Company::factory()->create();

        $response = $this->actingAs($user)->deleteJson("/api/v1/companies/{$otherCompany->id}");

        $response->assertStatus(403);
    }

    public function test_delete_requires_auth(): void
    {
        $company = Company::factory()->create();

        $response = $this->deleteJson("/api/v1/companies/{$company->id}");

        $response->assertStatus(401);
    }
}
