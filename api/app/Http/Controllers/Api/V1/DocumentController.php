<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Company;
use App\Models\Document;
use App\Models\Template;
use App\Models\User;
use App\Services\DocumentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly DocumentService $documentService,
    ) {}

    public function store(StoreDocumentRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $template = Template::findOrFail($request->validated('template_id'));

        $company = $request->filled('company_id')
            ? Company::findOrFail($request->validated('company_id'))
            : null;

        /** @var array<string, string> $slotData */
        $slotData = $request->validated('slot_data');

        $document = $this->documentService->generate($user, $template, $slotData, $company);

        return $this->success(
            (new DocumentResource($document))->resolve(),
            'Document generated',
            201
        );
    }

    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $documents = $user->documents()
            ->latest()
            ->get();

        return $this->success(
            DocumentResource::collection($documents)->resolve(),
            'Documents retrieved'
        );
    }

    public function show(Document $document): JsonResponse
    {
        Gate::authorize('view', $document);

        return $this->success(
            (new DocumentResource($document))->resolve(),
            'Document retrieved'
        );
    }

    public function download(Document $document): StreamedResponse
    {
        Gate::authorize('download', $document);

        if ($document->pdf_path === null) {
            abort(404, 'PDF not available.');
        }

        return Storage::disk('local')->download(
            $document->pdf_path,
            $document->reference_number.'.pdf',
            ['Content-Type' => 'application/pdf']
        );
    }
}
