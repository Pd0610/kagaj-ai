<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class SubscriptionController extends Controller
{
    public function current(): JsonResponse
    {
        return $this->success('TODO');
    }

    public function cancel(): JsonResponse
    {
        return $this->success('TODO');
    }
}
