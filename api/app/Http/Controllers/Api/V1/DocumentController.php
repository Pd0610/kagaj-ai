<?php

namespace App\Http\Controllers\Api\V1;

use Anuzpandey\LaravelNepaliDate\LaravelNepaliDate;
use App\Enums\DocumentStatus;
use App\Enums\Language;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\DocumentResource;
use App\Models\Company;
use App\Models\Document;
use App\Models\Template;
use App\Services\DocumentRenderer;
use App\Services\SlotValidator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DocumentController extends Controller
{
    public function __construct(
        private readonly SlotValidator $slotValidator,
        private readonly DocumentRenderer $renderer,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = Document::where('user_id', $request->user()->id)
            ->with('template:id,slug,name_en,name_ne,category,pdf_config')
            ->latest();

        if ($slug = $request->input('template_slug')) {
            $query->whereHas('template', fn ($q) => $q->where('slug', $slug));
        }

        $documents = $query->paginate(min((int) $request->input('per_page', 20), 50));

        return $this->paginated(DocumentResource::collection($documents));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'template_slug' => 'required|string|exists:templates,slug',
            'slot_data' => 'required|array',
            'language' => 'sometimes|string|in:en,ne',
            'company_uuid' => 'nullable|string|exists:companies,uuid',
        ]);

        $template = Template::where('slug', $request->input('template_slug'))
            ->published()
            ->firstOrFail();

        // Resolve company and merge pre-filled data with user-provided overrides
        $companyId = null;
        $slotData = $request->input('slot_data');

        if ($companyUuid = $request->input('company_uuid')) {
            $company = Company::where('uuid', $companyUuid)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            $companyId = $company->id;
            // Company data as base, user slot_data overrides
            $slotData = array_merge($company->toSlotData(), $slotData);
        }

        $slotData = $this->resolveSlotDefaults($slotData);
        $errors = $this->slotValidator->validate($template, $slotData);

        if (! empty($errors)) {
            return $this->error('Validation failed', 422, $errors);
        }

        $language = Language::from($request->input('language', 'ne'));

        $document = Document::create([
            'user_id' => $request->user()->id,
            'company_id' => $companyId,
            'template_id' => $template->id,
            'template_version' => $template->version,
            'title' => $template->name_ne ?: $template->name_en,
            'status' => DocumentStatus::Completed,
            'slot_data' => $slotData,
            'language' => $language,
            'is_watermarked' => false,
        ]);

        $document->load('template:id,slug,name_en,name_ne,category,pdf_config');

        return $this->created(new DocumentResource($document));
    }

    public function show(Request $request, Document $document): JsonResponse
    {
        if ($document->user_id !== $request->user()->id) {
            return $this->forbidden();
        }

        $document->load('template:id,slug,name_en,name_ne,category,pdf_config');

        return $this->success(new DocumentResource($document));
    }

    public function preview(Request $request, Document $document): JsonResponse
    {
        if ($document->user_id !== $request->user()->id) {
            return $this->forbidden();
        }

        $template = $document->template;

        if (! $template) {
            return $this->error('Template not found', 404);
        }

        $html = $this->renderer->render($template, $document->slot_data ?? []);

        return response()->json([
            'success' => true,
            'data' => [
                'html' => $html,
                'pdf_config' => $template->pdf_config,
            ],
            'message' => null,
            'errors' => null,
        ]);
    }

    public function download(Request $request, Document $document): BinaryFileResponse|JsonResponse
    {
        if ($document->user_id !== $request->user()->id) {
            return $this->forbidden();
        }

        $template = $document->template;

        if (! $template) {
            return $this->error('Template not found', 404);
        }

        try {
            $html = $this->renderer->render($template, $document->slot_data ?? []);
            $tmpPath = sys_get_temp_dir()."/documents/{$document->uuid}.pdf";

            if (! is_dir(dirname($tmpPath))) {
                mkdir(dirname($tmpPath), 0755, true);
            }

            $this->renderer->generatePdf($html, $tmpPath);

            $filename = str_replace(' ', '-', $document->title).'-'.$document->uuid.'.pdf';

            return response()->download($tmpPath, $filename, ['Content-Type' => 'application/pdf']);
        } catch (\Throwable $e) {
            return $this->error('PDF generation failed: '.$e->getMessage(), 500);
        }
    }

    /**
     * Resolve magic default values like $TODAY_BS in slot data.
     */
    private function resolveSlotDefaults(array $slotData): array
    {
        foreach ($slotData as $key => $value) {
            if ($value === '$TODAY_BS') {
                $slotData[$key] = LaravelNepaliDate::from(now()->format('Y-m-d'))
                    ->toNepaliDate(format: 'Y/m/d', locale: 'np');
            }
        }

        return $slotData;
    }

    public function destroy(Request $request, Document $document): JsonResponse
    {
        if ($document->user_id !== $request->user()->id) {
            return $this->forbidden();
        }

        if ($document->pdf_path && Storage::disk('local')->exists($document->pdf_path)) {
            Storage::disk('local')->delete($document->pdf_path);
        }

        $document->delete();

        return $this->success(null, 'Document deleted');
    }
}
