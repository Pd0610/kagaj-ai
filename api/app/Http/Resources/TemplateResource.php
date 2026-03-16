<?php

namespace App\Http\Resources;

use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Template */
class TemplateResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'name_ne' => $this->name_ne,
            'category' => $this->category,
            'description' => $this->description,
            'description_ne' => $this->description_ne,
            'is_premium' => $this->is_premium,
            'is_active' => $this->is_active,
            'is_locked' => $this->whenHas('is_locked'),
            'latest_schema' => $this->when(
                $this->relationLoaded('latestPublishedVersion') && $this->latestPublishedVersion !== null,
                fn () => $this->latestPublishedVersion->schema,
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
