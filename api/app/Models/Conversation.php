<?php

namespace App\Models;

use App\Enums\ConversationStatus;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'uuid',
        'user_id',
        'document_id',
        'status',
        'detected_intent',
        'filled_slots',
        'ai_context',
        'total_tokens',
    ];

    protected function casts(): array
    {
        return [
            'status' => ConversationStatus::class,
            'filled_slots' => 'json',
            'ai_context' => 'json',
            'total_tokens' => 'integer',
        ];
    }

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ConversationMessage::class);
    }

    // Scopes

    public function scopeActive($query)
    {
        return $query->where('status', ConversationStatus::Active);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}
