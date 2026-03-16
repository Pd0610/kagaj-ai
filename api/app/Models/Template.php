<?php

namespace App\Models;

use App\Enums\TemplateCategory;
use Database\Factories\TemplateFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Template extends Model
{
    /** @use HasFactory<TemplateFactory> */
    use HasFactory, HasUuids;

    /** @var list<string> */
    protected $fillable = [
        'name',
        'name_ne',
        'category',
        'description',
        'description_ne',
        'is_premium',
        'is_active',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'category' => TemplateCategory::class,
            'is_premium' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /** @return HasMany<TemplateVersion, $this> */
    public function versions(): HasMany
    {
        return $this->hasMany(TemplateVersion::class);
    }

    /** @return HasOne<TemplateVersion, $this> */
    public function latestPublishedVersion(): HasOne
    {
        return $this->hasOne(TemplateVersion::class)
            ->whereNotNull('published_at')
            ->orderByDesc('version');
    }
}
