<?php

namespace App\Http\Controllers\Api\V1;

use Anuzpandey\LaravelNepaliDate\LaravelNepaliDate;
use App\Enums\DocumentStatus;
use App\Enums\Language;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\DocumentResource;
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
        $documents = Document::where('user_id', $request->user()->id)
            ->with('template:id,slug,name_en,name_ne,category')
            ->latest()
            ->paginate(min((int) $request->input('per_page', 20), 50));

        return $this->paginated(DocumentResource::collection($documents));
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'template_slug' => 'required|string|exists:templates,slug',
            'slot_data' => 'required|array',
            'language' => 'sometimes|string|in:en,ne',
        ]);

        $template = Template::where('slug', $request->input('template_slug'))
            ->published()
            ->firstOrFail();

        $slotData = $this->resolveSlotDefaults($request->input('slot_data'));
        $errors = $this->slotValidator->validate($template, $slotData);

        if (! empty($errors)) {
            return $this->error('Validation failed', 422, $errors);
        }

        $language = Language::from($request->input('language', 'ne'));

        $document = Document::create([
            'user_id' => $request->user()->id,
            'template_id' => $template->id,
            'template_version' => $template->version,
            'title' => $template->name_ne ?: $template->name_en,
            'status' => DocumentStatus::Draft,
            'slot_data' => $slotData,
            'language' => $language,
            'is_watermarked' => false,
        ]);

        try {
            $html = $this->renderer->render($template, $slotData);

            $pdfDir = 'documents';
            Storage::disk('local')->makeDirectory($pdfDir);
            $pdfPath = "{$pdfDir}/{$document->uuid}.pdf";
            $fullPath = Storage::disk('local')->path($pdfPath);

            $this->renderer->generatePdf($html, $fullPath);

            $document->update([
                'status' => DocumentStatus::Completed,
                'pdf_path' => $pdfPath,
            ]);
        } catch (\Throwable $e) {
            $document->update(['status' => DocumentStatus::Failed]);

            return $this->error('PDF generation failed: '.$e->getMessage(), 500);
        }

        $document->load('template:id,slug,name_en,name_ne,category');

        return $this->created(new DocumentResource($document));
    }

    public function show(Request $request, Document $document): JsonResponse
    {
        if ($document->user_id !== $request->user()->id) {
            return $this->forbidden();
        }

        $document->load('template:id,slug,name_en,name_ne,category');

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
            'data' => ['html' => $html],
            'message' => null,
            'errors' => null,
        ]);
    }

    public function download(Request $request, Document $document): BinaryFileResponse|JsonResponse
    {
        if ($document->user_id !== $request->user()->id) {
            return $this->forbidden();
        }

        if (! $document->pdf_path || ! Storage::disk('local')->exists($document->pdf_path)) {
            return $this->error('PDF not found', 404);
        }

        $filename = str_replace(' ', '-', $document->title).'-'.$document->uuid.'.pdf';

        return response()->download(
            Storage::disk('local')->path($document->pdf_path),
            $filename,
            ['Content-Type' => 'application/pdf']
        );
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
