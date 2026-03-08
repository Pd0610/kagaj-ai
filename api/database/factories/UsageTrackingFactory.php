<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UsageTracking> */
class UsageTrackingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'period' => now()->format('Y-m'),
            'documents_generated' => 0,
            'ai_tokens_used' => 0,
        ];
    }
}
