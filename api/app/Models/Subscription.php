<?php

namespace App\Models;

use App\Enums\SubscriptionStatus;
use App\Enums\UserTier;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tier',
        'status',
        'payment_provider',
        'starts_at',
        'ends_at',
        'cancelled_at',
        'auto_renew',
    ];

    protected function casts(): array
    {
        return [
            'tier' => UserTier::class,
            'status' => SubscriptionStatus::class,
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'auto_renew' => 'boolean',
        ];
    }

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Scopes

    public function scopeActive($query)
    {
        return $query->where('status', SubscriptionStatus::Active);
    }

    // Helpers

    public function isActive(): bool
    {
        /** @var \Illuminate\Support\Carbon|null $endsAt */
        $endsAt = $this->ends_at;

        return $this->status === SubscriptionStatus::Active && $endsAt !== null && $endsAt->isFuture();
    }
}
