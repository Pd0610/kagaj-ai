<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class UsageController extends Controller
{
    public function current(): JsonResponse
    {
        return $this->success('TODO');
    }

    public function dashboardStats(): JsonResponse
    {
        return $this->success('TODO');
    }
}
