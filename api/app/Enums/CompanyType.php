<?php

namespace App\Enums;

enum CompanyType: string
{
    case PrivateLimited = 'pvt_ltd';
    case PublicLimited = 'public_ltd';
    case Partnership = 'partnership';
    case SoleProprietorship = 'sole_prop';
    case Ngo = 'ngo';
    case Cooperative = 'cooperative';
}
