<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UsageTracking extends Model
{
    use HasFactory;

    protected $table = 'usage_tracking';

    protected $fillable = [
        'user_id',
        'period',
        'documents_generated',
        'ai_tokens_used',
    ];

    protected function casts(): array
    {
        return [
            'documents_generated' => 'integer',
            'ai_tokens_used' => 'integer',
        ];
    }

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes

    public function scopeForPeriod($query, string $period)
    {
        return $query->where('period', $period);
    }

    public function scopeCurrentMonth($query)
    {
        return $query->where('period', now()->format('Y-m'));
    }
}
