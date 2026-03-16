<?php

namespace App\Services;

use App\Exceptions\TierLimitException;
use App\Models\Company;
use App\Models\User;

class CompanyService
{
    /**
     * @param  array<string, mixed>  $data
     *
     * @throws TierLimitException
     */
    public function create(User $user, array $data): Company
    {
        $currentCount = $user->companies()->count();

        if (! TierService::canCreateCompany($user->plan, $currentCount)) {
            throw new TierLimitException(
                'Company limit reached for your plan. Upgrade to create more companies.'
            );
        }

        /** @var Company $company */
        $company = $user->companies()->create($data);

        return $company;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Company $company, array $data): Company
    {
        $company->update($data);

        return $company->fresh() ?? $company;
    }

    public function delete(Company $company): void
    {
        $company->delete();
    }
}
