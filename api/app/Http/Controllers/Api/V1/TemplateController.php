<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\TemplateResource;
use App\Models\Template;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Template::published()->orderBy('sort_order');

        if ($request->filled('category')) {
            $query->byCategory($request->input('category'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name_en', 'ilike', "%{$search}%")
                    ->orWhere('name_ne', 'like', "%{$search}%")
                    ->orWhere('description_en', 'ilike', "%{$search}%");
            });
        }

        $perPage = min((int) $request->input('per_page', 20), 50);
        $templates = $query->paginate($perPage);

        return $this->paginated(TemplateResource::collection($templates));
    }

    public function categories(): JsonResponse
    {
        $categories = Template::published()
            ->selectRaw('category, count(*) as templates_count')
            ->groupBy('category')
            ->orderBy('category')
            ->get()
            ->map(fn ($row) => [
                'slug' => $row->category,
                'name' => self::categoryLabel($row->category),
                'templates_count' => (int) $row->templates_count,
            ]);

        return $this->success($categories);
    }

    public function show(Template $template): JsonResponse
    {
        if (! $template->is_published) {
            return $this->notFound('Template not found');
        }

        return $this->success(new TemplateResource($template));
    }

    private static function categoryLabel(string $slug): string
    {
        return match ($slug) {
            'ocr' => 'Office of the Company Registrar',
            'tax' => 'Tax & Revenue',
            'rental' => 'Rental Agreements',
            'employment' => 'Employment',
            'ip' => 'Intellectual Property',
            'banking' => 'Banking',
            'ward_office' => 'Ward Office',
            default => ucfirst(str_replace('_', ' ', $slug)),
        };
    }
}
