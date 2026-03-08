<?php

namespace Database\Factories;

use App\Enums\PaymentProvider;
use App\Enums\PaymentStatus;
use App\Enums\PaymentType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment> */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => PaymentType::OneTime,
            'amount' => fake()->randomElement([10000, 29900, 99900]),
            'currency' => 'NPR',
            'provider' => PaymentProvider::Esewa,
            'status' => PaymentStatus::Pending,
        ];
    }
}
