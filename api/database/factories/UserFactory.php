<?php

namespace Database\Factories;

use App\Enums\Language;
use App\Enums\UserTier;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/** @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User> */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'phone' => fake()->optional()->numerify('98########'),
            'language_preference' => Language::English,
            'tier' => UserTier::Free,
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function pro(): static
    {
        return $this->state(fn () => ['tier' => UserTier::Pro]);
    }

    public function business(): static
    {
        return $this->state(fn () => ['tier' => UserTier::Business]);
    }
}
