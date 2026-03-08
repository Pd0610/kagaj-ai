<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    public function subscribe(): JsonResponse
    {
        return $this->success('TODO');
    }

    public function payPerDoc(): JsonResponse
    {
        return $this->success('TODO');
    }

    public function history(): JsonResponse
    {
        return $this->success('TODO');
    }

    public function verify(): JsonResponse
    {
        return $this->success('TODO');
    }
}
