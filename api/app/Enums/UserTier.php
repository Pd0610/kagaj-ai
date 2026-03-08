<?php

namespace App\Enums;

enum UserTier: string
{
    case Free = 'free';
    case Pro = 'pro';
    case Business = 'business';

    public function monthlyDocLimit(): int
    {
        return match ($this) {
            self::Free => 3,
            self::Pro => 50,
            self::Business => 500,
        };
    }
}
