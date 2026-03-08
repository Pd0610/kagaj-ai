<?php

namespace App\Models;

use App\Enums\PaymentProvider;
use App\Enums\PaymentStatus;
use App\Enums\PaymentType;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'uuid',
        'user_id',
        'subscription_id',
        'document_id',
        'type',
        'amount',
        'currency',
        'provider',
        'provider_transaction_id',
        'status',
        'paid_at',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'type' => PaymentType::class,
            'status' => PaymentStatus::class,
            'provider' => PaymentProvider::class,
            'amount' => 'integer',
            'paid_at' => 'datetime',
            'metadata' => 'json',
        ];
    }

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    // Helpers

    public function amountInRupees(): float
    {
        return $this->amount / 100;
    }
}
