<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name_en,
            'name_ne' => $this->name_ne,
            'category' => $this->category,
            'description' => $this->description_en,
            'description_ne' => $this->description_ne,
            'price' => $this->price,
            'is_free_eligible' => $this->resource->isFreeEligible(),
            'version' => $this->version,
            'schema' => $this->when($request->routeIs('templates.show'), $this->schema),
        ];
    }
}
