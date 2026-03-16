<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TemplateResource;
use App\Models\Template;
use App\Models\User;
use App\Services\TierService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $canAccessPremium = TierService::canAccessPremiumTemplates($user->plan);

        $templates = Template::query()
            ->where('is_active', true)
            ->with('latestPublishedVersion')
            ->orderBy('name')
            ->get()
            ->each(function (Template $template) use ($canAccessPremium): void {
                $template->setAttribute('is_locked', $template->is_premium && ! $canAccessPremium);
            });

        return $this->success(TemplateResource::collection($templates)->resolve());
    }

    public function show(Request $request, Template $template): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $canAccessPremium = TierService::canAccessPremiumTemplates($user->plan);

        $template->load('latestPublishedVersion');
        $template->setAttribute('is_locked', $template->is_premium && ! $canAccessPremium);

        return $this->success((new TemplateResource($template))->resolve());
    }
}
