<?php

namespace Database\Factories;

use App\Enums\SubscriptionStatus;
use App\Enums\UserTier;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subscription> */
class SubscriptionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'tier' => UserTier::Pro,
            'status' => SubscriptionStatus::Active,
            'payment_provider' => 'esewa',
            'starts_at' => now(),
            'ends_at' => now()->addMonth(),
            'auto_renew' => true,
        ];
    }
}
