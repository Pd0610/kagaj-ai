<?php

namespace App\Services;

use App\Enums\Plan;

class TierService
{
    /** @return array{docs_per_month: int, companies: int, premium_templates: bool} */
    public static function limits(Plan $plan): array
    {
        return match ($plan) {
            Plan::Free => [
                'docs_per_month' => 5,
                'companies' => 1,
                'premium_templates' => false,
            ],
            Plan::Pro => [
                'docs_per_month' => PHP_INT_MAX,
                'companies' => PHP_INT_MAX,
                'premium_templates' => true,
            ],
            Plan::Enterprise => [
                'docs_per_month' => PHP_INT_MAX,
                'companies' => PHP_INT_MAX,
                'premium_templates' => true,
            ],
        };
    }

    public static function canCreateCompany(Plan $plan, int $currentCount): bool
    {
        return $currentCount < self::limits($plan)['companies'];
    }

    public static function canGenerateDocument(Plan $plan, int $currentMonthCount): bool
    {
        return $currentMonthCount < self::limits($plan)['docs_per_month'];
    }

    public static function canAccessPremiumTemplates(Plan $plan): bool
    {
        return self::limits($plan)['premium_templates'];
    }
}
