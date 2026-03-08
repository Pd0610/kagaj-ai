<?php

namespace Database\Factories;

use App\Enums\MessageRole;
use App\Models\Conversation;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ConversationMessage> */
class ConversationMessageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'conversation_id' => Conversation::factory(),
            'role' => MessageRole::User,
            'content' => fake()->paragraph(),
            'token_count' => fake()->numberBetween(10, 500),
        ];
    }
}
