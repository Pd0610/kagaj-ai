<?php

namespace Database\Factories;

use App\Enums\ConversationStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Conversation> */
class ConversationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'status' => ConversationStatus::Active,
            'filled_slots' => [],
            'ai_context' => [],
            'total_tokens' => 0,
        ];
    }
}
