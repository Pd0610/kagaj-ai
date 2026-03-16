<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use App\Models\User;
use App\Services\CompanyService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CompanyController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly CompanyService $companyService
    ) {}

    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $companies = $user->companies()
            ->latest()
            ->get();

        return $this->success(
            CompanyResource::collection($companies)->resolve(),
            'Companies retrieved'
        );
    }

    public function store(StoreCompanyRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $company = $this->companyService->create($user, $request->validated());

        return $this->success(
            (new CompanyResource($company))->resolve(),
            'Company created',
            201
        );
    }

    public function show(Company $company): JsonResponse
    {
        Gate::authorize('view', $company);

        return $this->success(
            (new CompanyResource($company))->resolve(),
            'Company retrieved'
        );
    }

    public function update(UpdateCompanyRequest $request, Company $company): JsonResponse
    {
        Gate::authorize('update', $company);

        $company = $this->companyService->update($company, $request->validated());

        return $this->success(
            (new CompanyResource($company))->resolve(),
            'Company updated'
        );
    }

    public function destroy(Company $company): JsonResponse
    {
        Gate::authorize('delete', $company);

        $this->companyService->delete($company);

        return $this->success(message: 'Company deleted');
    }
}
