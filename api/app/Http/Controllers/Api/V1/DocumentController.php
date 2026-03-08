<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\JsonResponse;

class DocumentController extends Controller
{
    public function index(): JsonResponse
    {
        return $this->success('TODO');
    }

    public function show(Document $document): JsonResponse
    {
        return $this->success('TODO');
    }

    public function preview(Document $document): JsonResponse
    {
        return $this->success('TODO');
    }

    public function download(Document $document): JsonResponse
    {
        return $this->success('TODO');
    }

    public function regenerate(Document $document): JsonResponse
    {
        return $this->success('TODO');
    }

    public function destroy(Document $document): JsonResponse
    {
        return $this->success('TODO');
    }
}
