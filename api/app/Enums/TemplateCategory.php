<?php

namespace App\Enums;

enum TemplateCategory: string
{
    case CompanyRegistration = 'company_registration';
    case TaxCompliance = 'tax_compliance';
    case BoardResolution = 'board_resolution';
    case LegalAgreement = 'legal_agreement';
    case HrDocument = 'hr_document';
    case General = 'general';

    public function label(): string
    {
        return match ($this) {
            self::CompanyRegistration => 'Company Registration',
            self::TaxCompliance => 'Tax Compliance',
            self::BoardResolution => 'Board Resolution',
            self::LegalAgreement => 'Legal Agreement',
            self::HrDocument => 'HR Document',
            self::General => 'General',
        };
    }

    public function labelNe(): string
    {
        return match ($this) {
            self::CompanyRegistration => 'कम्पनी दर्ता',
            self::TaxCompliance => 'कर अनुपालन',
            self::BoardResolution => 'बोर्ड प्रस्ताव',
            self::LegalAgreement => 'कानुनी सम्झौता',
            self::HrDocument => 'मानव संसाधन कागजात',
            self::General => 'सामान्य',
        };
    }
}
