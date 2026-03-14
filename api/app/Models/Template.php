<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Template extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'slug',
        'name_en',
        'name_ne',
        'category',
        'description_en',
        'description_ne',
        'schema',
        'html_body',
        'pdf_config',
        'version',
        'is_published',
        'price',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'schema' => 'json',
            'pdf_config' => 'json',
            'is_published' => 'boolean',
            'version' => 'integer',
            'price' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    // Relationships

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    // Scopes

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    // Helpers

    public function isFreeEligible(): bool
    {
        return $this->price === 0;
    }
}
