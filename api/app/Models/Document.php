<?php

namespace App\Models;

use App\Enums\DocumentStatus;
use App\Enums\Language;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'uuid',
        'user_id',
        'template_id',
        'template_version',
        'title',
        'status',
        'slot_data',
        'language',
        'pdf_path',
        'is_watermarked',
    ];

    protected function casts(): array
    {
        return [
            'slot_data' => 'json',
            'status' => DocumentStatus::class,
            'language' => Language::class,
            'is_watermarked' => 'boolean',
            'template_version' => 'integer',
        ];
    }

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    public function conversation(): HasOne
    {
        return $this->hasOne(Conversation::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Scopes

    public function scopeCompleted($query)
    {
        return $query->where('status', DocumentStatus::Completed);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}
