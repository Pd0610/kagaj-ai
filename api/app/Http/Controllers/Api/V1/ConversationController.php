<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Http\JsonResponse;

class ConversationController extends Controller
{
    public function store(): JsonResponse
    {
        return $this->success('TODO');
    }

    public function show(Conversation $conversation): JsonResponse
    {
        return $this->success('TODO');
    }

    public function destroy(Conversation $conversation): JsonResponse
    {
        return $this->success('TODO');
    }

    public function sendMessage(Conversation $conversation): JsonResponse
    {
        return $this->success('TODO');
    }

    public function confirm(Conversation $conversation): JsonResponse
    {
        return $this->success('TODO');
    }
}
