<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\CompanyMemberResource;
use App\Http\Resources\Api\V1\CompanyResource;
use App\Models\Company;
use App\Models\CompanyMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $companies = Company::where('user_id', $request->user()->id)
            ->withCount('documents')
            ->with('members')
            ->latest()
            ->get();

        return $this->success(CompanyResource::collection($companies));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name_en' => 'required|string|max:255',
            'name_ne' => 'nullable|string|max:255',
            'registration_number' => 'nullable|string|max:50',
            'pan_number' => 'nullable|string|max:20',
            'vat_number' => 'nullable|string|max:20',
            'company_type' => 'required|string|in:pvt_ltd,public_ltd,partnership,sole_prop,ngo,cooperative',
            'incorporation_date' => 'nullable|date',
            'district_en' => 'nullable|string|max:100',
            'district_ne' => 'nullable|string|max:100',
            'municipality_en' => 'nullable|string|max:100',
            'municipality_ne' => 'nullable|string|max:100',
            'ward' => 'nullable|string|max:10',
            'tole_en' => 'nullable|string|max:255',
            'tole_ne' => 'nullable|string|max:255',
            'authorized_capital' => 'nullable|integer|min:0',
            'paid_up_capital' => 'nullable|integer|min:0',
            'share_value' => 'nullable|integer|min:0',
            'total_shares' => 'nullable|integer|min:0',
            'fiscal_year_start' => 'nullable|string|max:5',
            'fiscal_year_end' => 'nullable|string|max:5',
            'sector' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'bank_account_number' => 'nullable|string|max:50',
            'bank_branch' => 'nullable|string|max:255',
            'auditor_name' => 'nullable|string|max:255',
            'auditor_firm' => 'nullable|string|max:255',
            'auditor_ican_number' => 'nullable|string|max:50',
        ]);

        $company = Company::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        $company->load('members');

        return $this->created(new CompanyResource($company));
    }

    public function show(Request $request, Company $company): JsonResponse
    {
        if ($company->user_id !== $request->user()->id) {
            return $this->forbidden();
        }

        $company->load('members');
        $company->loadCount('documents');

        return $this->success(new CompanyResource($company));
    }

    public function update(Request $request, Company $company): JsonResponse
    {
        if ($company->user_id !== $request->user()->id) {
            return $this->forbidden();
        }

        $validated = $request->validate([
            'name_en' => 'sometimes|string|max:255',
            'name_ne' => 'nullable|string|max:255',
            'registration_number' => 'nullable|string|max:50',
            'pan_number' => 'nullable|string|max:20',
            'vat_number' => 'nullable|string|max:20',
            'company_type' => 'sometimes|string|in:pvt_ltd,public_ltd,partnership,sole_prop,ngo,cooperative',
            'incorporation_date' => 'nullable|date',
            'district_en' => 'nullable|string|max:100',
            'district_ne' => 'nullable|string|max:100',
            'municipality_en' => 'nullable|string|max:100',
            'municipality_ne' => 'nullable|string|max:100',
            'ward' => 'nullable|string|max:10',
            'tole_en' => 'nullable|string|max:255',
            'tole_ne' => 'nullable|string|max:255',
            'authorized_capital' => 'nullable|integer|min:0',
            'paid_up_capital' => 'nullable|integer|min:0',
            'share_value' => 'nullable|integer|min:0',
            'total_shares' => 'nullable|integer|min:0',
            'fiscal_year_start' => 'nullable|string|max:5',
            'fiscal_year_end' => 'nullable|string|max:5',
            'sector' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'bank_account_number' => 'nullable|string|max:50',
            'bank_branch' => 'nullable|string|max:255',
            'auditor_name' => 'nullable|string|max:255',
            'auditor_firm' => 'nullable|string|max:255',
            'auditor_ican_number' => 'nullable|string|max:50',
        ]);

        $company->update($validated);
        $company->load('members');

        return $this->success(new CompanyResource($company));
    }

    public function destroy(Request $request, Company $company): JsonResponse
    {
        if ($company->user_id !== $request->user()->id) {
            return $this->forbidden();
        }

        $company->delete();

        return $this->success(null, 'Company deleted');
    }

    /**
     * Get pre-filled slot data for a template based on company data.
     */
    public function prefill(Request $request, Company $company): JsonResponse
    {
        if ($company->user_id !== $request->user()->id) {
            return $this->forbidden();
        }

        return $this->success($company->toSlotData());
    }

    // ── Company Members ──

    public function storeMembers(Request $request, Company $company): JsonResponse
    {
        if ($company->user_id !== $request->user()->id) {
            return $this->forbidden();
        }

        $validated = $request->validate([
            'members' => 'required|array|min:1',
            'members.*.role' => 'required|string|in:director,shareholder,secretary,auditor,partner,proprietor',
            'members.*.name_en' => 'required|string|max:255',
            'members.*.name_ne' => 'nullable|string|max:255',
            'members.*.father_name_en' => 'nullable|string|max:255',
            'members.*.father_name_ne' => 'nullable|string|max:255',
            'members.*.grandfather_name_en' => 'nullable|string|max:255',
            'members.*.grandfather_name_ne' => 'nullable|string|max:255',
            'members.*.citizenship_number' => 'nullable|string|max:50',
            'members.*.citizenship_issued_district' => 'nullable|string|max:100',
            'members.*.citizenship_issued_date' => 'nullable|date',
            'members.*.district_en' => 'nullable|string|max:100',
            'members.*.district_ne' => 'nullable|string|max:100',
            'members.*.municipality_en' => 'nullable|string|max:100',
            'members.*.municipality_ne' => 'nullable|string|max:100',
            'members.*.ward' => 'nullable|string|max:10',
            'members.*.phone' => 'nullable|string|max:20',
            'members.*.email' => 'nullable|email|max:255',
            'members.*.share_count' => 'nullable|integer|min:0',
            'members.*.share_percentage' => 'nullable|numeric|min:0|max:100',
            'members.*.appointment_date' => 'nullable|date',
            'members.*.resignation_date' => 'nullable|date',
            'members.*.is_chairperson' => 'nullable|boolean',
            'members.*.is_managing_director' => 'nullable|boolean',
        ]);

        $members = [];
        foreach ($validated['members'] as $memberData) {
            $members[] = $company->members()->create($memberData);
        }

        return $this->created(CompanyMemberResource::collection($members));
    }

    public function updateMember(Request $request, Company $company, CompanyMember $member): JsonResponse
    {
        if ($company->user_id !== $request->user()->id) {
            return $this->forbidden();
        }

        if ($member->company_id !== $company->id) {
            return $this->notFound('Member not found in this company');
        }

        $validated = $request->validate([
            'role' => 'sometimes|string|in:director,shareholder,secretary,auditor,partner,proprietor',
            'name_en' => 'sometimes|string|max:255',
            'name_ne' => 'nullable|string|max:255',
            'father_name_en' => 'nullable|string|max:255',
            'father_name_ne' => 'nullable|string|max:255',
            'grandfather_name_en' => 'nullable|string|max:255',
            'grandfather_name_ne' => 'nullable|string|max:255',
            'citizenship_number' => 'nullable|string|max:50',
            'citizenship_issued_district' => 'nullable|string|max:100',
            'citizenship_issued_date' => 'nullable|date',
            'district_en' => 'nullable|string|max:100',
            'district_ne' => 'nullable|string|max:100',
            'municipality_en' => 'nullable|string|max:100',
            'municipality_ne' => 'nullable|string|max:100',
            'ward' => 'nullable|string|max:10',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'share_count' => 'nullable|integer|min:0',
            'share_percentage' => 'nullable|numeric|min:0|max:100',
            'appointment_date' => 'nullable|date',
            'resignation_date' => 'nullable|date',
            'is_chairperson' => 'nullable|boolean',
            'is_managing_director' => 'nullable|boolean',
        ]);

        $member->update($validated);

        return $this->success(new CompanyMemberResource($member));
    }

    public function destroyMember(Request $request, Company $company, CompanyMember $member): JsonResponse
    {
        if ($company->user_id !== $request->user()->id) {
            return $this->forbidden();
        }

        if ($member->company_id !== $company->id) {
            return $this->notFound('Member not found in this company');
        }

        $member->delete();

        return $this->success(null, 'Member removed');
    }
}
