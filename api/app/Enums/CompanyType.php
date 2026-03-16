<?php

namespace App\Enums;

enum CompanyType: string
{
    case PvtLtd = 'pvt_ltd';
    case PublicLtd = 'public_ltd';
    case Partnership = 'partnership';
    case SoleProprietorship = 'sole_proprietorship';
    case Ngo = 'ngo';
    case Cooperative = 'cooperative';

    public function label(): string
    {
        return match ($this) {
            self::PvtLtd => 'Private Limited',
            self::PublicLtd => 'Public Limited',
            self::Partnership => 'Partnership',
            self::SoleProprietorship => 'Sole Proprietorship',
            self::Ngo => 'NGO',
            self::Cooperative => 'Cooperative',
        };
    }
}
