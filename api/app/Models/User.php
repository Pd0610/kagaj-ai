<?php

namespace App\Models;

use App\Enums\Language;
use App\Enums\UserTier;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'language_preference',
        'tier',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'language_preference' => Language::class,
            'tier' => UserTier::class,
        ];
    }

    // Relationships

    public function companies(): HasMany
    {
        return $this->hasMany(Company::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function activeSubscription(): HasOne
    {
        return $this->hasOne(Subscription::class)->where('status', 'active')->latestOfMany();
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function usageTracking(): HasMany
    {
        return $this->hasMany(UsageTracking::class);
    }

    // Scopes & helpers

    public function isFree(): bool
    {
        return $this->tier === UserTier::Free;
    }

    public function isPro(): bool
    {
        return $this->tier === UserTier::Pro;
    }

    public function isBusiness(): bool
    {
        return $this->tier === UserTier::Business;
    }
}
