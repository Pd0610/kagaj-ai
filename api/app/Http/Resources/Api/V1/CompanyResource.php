<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'uuid' => $this->uuid,
            'name_en' => $this->name_en,
            'name_ne' => $this->name_ne,
            'registration_number' => $this->registration_number,
            'pan_number' => $this->pan_number,
            'vat_number' => $this->vat_number,
            'company_type' => $this->company_type,
            'incorporation_date' => $this->incorporation_date?->format('Y-m-d'),

            // Address
            'district_en' => $this->district_en,
            'district_ne' => $this->district_ne,
            'municipality_en' => $this->municipality_en,
            'municipality_ne' => $this->municipality_ne,
            'ward' => $this->ward,
            'tole_en' => $this->tole_en,
            'tole_ne' => $this->tole_ne,

            // Capital
            'authorized_capital' => $this->authorized_capital,
            'paid_up_capital' => $this->paid_up_capital,
            'share_value' => $this->share_value,
            'total_shares' => $this->total_shares,

            // Fiscal
            'fiscal_year_start' => $this->fiscal_year_start,
            'fiscal_year_end' => $this->fiscal_year_end,

            // Contact
            'sector' => $this->sector,
            'phone' => $this->phone,
            'email' => $this->email,
            'website' => $this->website,

            // Banking
            'bank_name' => $this->bank_name,
            'bank_account_number' => $this->bank_account_number,
            'bank_branch' => $this->bank_branch,

            // Auditor
            'auditor_name' => $this->auditor_name,
            'auditor_firm' => $this->auditor_firm,
            'auditor_ican_number' => $this->auditor_ican_number,

            // Relations
            'members' => CompanyMemberResource::collection($this->whenLoaded('members')),
            'documents_count' => $this->when(
                $this->documents_count !== null,
                $this->documents_count,
            ),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
