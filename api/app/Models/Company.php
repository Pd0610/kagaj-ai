<?php

namespace App\Models;

use App\Enums\CompanyType;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'uuid',
        'user_id',
        'name_en',
        'name_ne',
        'registration_number',
        'pan_number',
        'vat_number',
        'company_type',
        'incorporation_date',
        'district_en',
        'district_ne',
        'municipality_en',
        'municipality_ne',
        'ward',
        'tole_en',
        'tole_ne',
        'authorized_capital',
        'paid_up_capital',
        'share_value',
        'total_shares',
        'fiscal_year_start',
        'fiscal_year_end',
        'sector',
        'phone',
        'email',
        'website',
        'bank_name',
        'bank_account_number',
        'bank_branch',
        'auditor_name',
        'auditor_firm',
        'auditor_ican_number',
    ];

    protected function casts(): array
    {
        return [
            'company_type' => CompanyType::class,
            'incorporation_date' => 'date',
            'authorized_capital' => 'integer',
            'paid_up_capital' => 'integer',
            'share_value' => 'integer',
            'total_shares' => 'integer',
        ];
    }

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(CompanyMember::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    // Scoped member helpers

    public function directors(): HasMany
    {
        return $this->members()->where('role', 'director');
    }

    public function shareholders(): HasMany
    {
        return $this->members()->where('role', 'shareholder');
    }

    public function secretary(): HasMany
    {
        return $this->members()->where('role', 'secretary');
    }

    public function auditorMember(): HasMany
    {
        return $this->members()->where('role', 'auditor');
    }

    /**
     * Build a slot data map from company + member data for template pre-filling.
     *
     * @return array<string, mixed>
     */
    public function toSlotData(): array
    {
        $this->loadMissing('members');

        $data = [
            // Company identity
            'company_name_en' => $this->name_en,
            'company_name_ne' => $this->name_ne,
            'company_name' => $this->name_ne ?? $this->name_en,
            'registration_number' => $this->registration_number,
            'pan_number' => $this->pan_number,
            'vat_number' => $this->vat_number,
            'company_type' => $this->company_type instanceof CompanyType ? $this->company_type->value : $this->company_type,
            'incorporation_date' => $this->incorporation_date instanceof \DateTimeInterface ? $this->incorporation_date->format('Y-m-d') : $this->incorporation_date,

            // Address
            'district_en' => $this->district_en,
            'district_ne' => $this->district_ne,
            'district' => $this->district_ne ?? $this->district_en,
            'municipality_en' => $this->municipality_en,
            'municipality_ne' => $this->municipality_ne,
            'municipality' => $this->municipality_ne ?? $this->municipality_en,
            'ward' => $this->ward,
            'tole_en' => $this->tole_en,
            'tole_ne' => $this->tole_ne,
            'registered_address_en' => implode(', ', array_filter([
                $this->tole_en, "Ward {$this->ward}", $this->municipality_en, $this->district_en,
            ])),
            'registered_address_ne' => implode(', ', array_filter([
                $this->tole_ne, $this->ward ? "वडा नं. {$this->ward}" : null, $this->municipality_ne, $this->district_ne,
            ])),

            // Capital & Shares
            'authorized_capital' => $this->authorized_capital,
            'paid_up_capital' => $this->paid_up_capital,
            'share_value' => $this->share_value,
            'total_shares' => $this->total_shares,

            // Fiscal year
            'fiscal_year_start' => $this->fiscal_year_start,
            'fiscal_year_end' => $this->fiscal_year_end,

            // Contact
            'company_phone' => $this->phone,
            'company_email' => $this->email,

            // Banking
            'bank_name' => $this->bank_name,
            'bank_account_number' => $this->bank_account_number,
            'bank_branch' => $this->bank_branch,

            // Auditor
            'auditor_name' => $this->auditor_name,
            'auditor_firm' => $this->auditor_firm,
            'auditor_ican_number' => $this->auditor_ican_number,
        ];

        // Members by role
        $directors = $this->members->where('role', 'director')->values();
        $shareholders = $this->members->where('role', 'shareholder')->values();

        /** @var \Illuminate\Database\Eloquent\Collection<int, CompanyMember> $directors */
        /** @var \Illuminate\Database\Eloquent\Collection<int, CompanyMember> $shareholders */
        $data['directors'] = $directors->map(fn (CompanyMember $m) => $m->toSlotData())->toArray();
        $data['shareholders'] = $shareholders->map(fn (CompanyMember $m) => $m->toSlotData())->toArray();
        $data['director_count'] = $directors->count();
        $data['shareholder_count'] = $shareholders->count();

        // Chairperson shortcut
        /** @var CompanyMember|null $chair */
        $chair = $directors->firstWhere('is_chairperson', true);
        if ($chair) {
            $data['chairperson_name_en'] = $chair->name_en;
            $data['chairperson_name_ne'] = $chair->name_ne;
        }

        return $data;
    }
}
