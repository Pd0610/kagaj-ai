<?php

namespace App\Models;

use App\Enums\MemberRole;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyMember extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'uuid',
        'company_id',
        'role',
        'name_en',
        'name_ne',
        'father_name_en',
        'father_name_ne',
        'grandfather_name_en',
        'grandfather_name_ne',
        'citizenship_number',
        'citizenship_issued_district',
        'citizenship_issued_date',
        'district_en',
        'district_ne',
        'municipality_en',
        'municipality_ne',
        'ward',
        'phone',
        'email',
        'share_count',
        'share_percentage',
        'appointment_date',
        'resignation_date',
        'is_chairperson',
        'is_managing_director',
    ];

    protected function casts(): array
    {
        return [
            'role' => MemberRole::class,
            'citizenship_issued_date' => 'date',
            'appointment_date' => 'date',
            'resignation_date' => 'date',
            'share_count' => 'integer',
            'share_percentage' => 'decimal:2',
            'is_chairperson' => 'boolean',
            'is_managing_director' => 'boolean',
        ];
    }

    // Relationships

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Convert member to a flat slot data map for template pre-filling.
     *
     * @return array<string, mixed>
     */
    public function toSlotData(): array
    {
        return [
            'name_en' => $this->name_en,
            'name_ne' => $this->name_ne,
            'name' => $this->name_ne ?? $this->name_en,
            'father_name_en' => $this->father_name_en,
            'father_name_ne' => $this->father_name_ne,
            'grandfather_name_en' => $this->grandfather_name_en,
            'grandfather_name_ne' => $this->grandfather_name_ne,
            'citizenship_number' => $this->citizenship_number,
            'citizenship_issued_district' => $this->citizenship_issued_district,
            'citizenship_issued_date' => $this->citizenship_issued_date instanceof \DateTimeInterface ? $this->citizenship_issued_date->format('Y-m-d') : $this->citizenship_issued_date,
            'district_en' => $this->district_en,
            'district_ne' => $this->district_ne,
            'municipality_en' => $this->municipality_en,
            'municipality_ne' => $this->municipality_ne,
            'ward' => $this->ward,
            'address_en' => implode(', ', array_filter([
                "Ward {$this->ward}", $this->municipality_en, $this->district_en,
            ])),
            'address_ne' => implode(', ', array_filter([
                $this->ward ? "वडा नं. {$this->ward}" : null, $this->municipality_ne, $this->district_ne,
            ])),
            'phone' => $this->phone,
            'email' => $this->email,
            'share_count' => $this->share_count,
            'share_percentage' => $this->share_percentage,
            'appointment_date' => $this->appointment_date instanceof \DateTimeInterface ? $this->appointment_date->format('Y-m-d') : $this->appointment_date,
            'is_chairperson' => $this->is_chairperson,
            'is_managing_director' => $this->is_managing_director,
        ];
    }
}
