<?php

namespace App\Http\Resources;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Document */
class DocumentResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'reference_number' => $this->reference_number,
            'template_id' => $this->template_id,
            'template_version_id' => $this->template_version_id,
            'company_id' => $this->company_id,
            'slot_data' => $this->slot_data,
            'has_pdf' => $this->pdf_path !== null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
