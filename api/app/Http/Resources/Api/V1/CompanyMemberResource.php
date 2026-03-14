<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'role' => $this->role,
            'name_en' => $this->name_en,
            'name_ne' => $this->name_ne,
            'father_name_en' => $this->father_name_en,
            'father_name_ne' => $this->father_name_ne,
            'grandfather_name_en' => $this->grandfather_name_en,
            'grandfather_name_ne' => $this->grandfather_name_ne,
            'citizenship_number' => $this->citizenship_number,
            'citizenship_issued_district' => $this->citizenship_issued_district,
            'citizenship_issued_date' => $this->citizenship_issued_date?->format('Y-m-d'),
            'district_en' => $this->district_en,
            'district_ne' => $this->district_ne,
            'municipality_en' => $this->municipality_en,
            'municipality_ne' => $this->municipality_ne,
            'ward' => $this->ward,
            'phone' => $this->phone,
            'email' => $this->email,
            'share_count' => $this->share_count,
            'share_percentage' => $this->share_percentage,
            'appointment_date' => $this->appointment_date?->format('Y-m-d'),
            'resignation_date' => $this->resignation_date?->format('Y-m-d'),
            'is_chairperson' => $this->is_chairperson,
            'is_managing_director' => $this->is_managing_director,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
