<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'title' => $this->title,
            'template_slug' => $this->template?->slug,
            'template_name' => $this->template?->name_en,
            'template_name_ne' => $this->template?->name_ne,
            'status' => $this->status,
            'language' => $this->language,
            'is_watermarked' => $this->is_watermarked,
            'slot_data' => $this->when(
                $request->routeIs('documents.show'),
                $this->slot_data
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
