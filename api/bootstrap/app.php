<?php

use App\Exceptions\TierLimitException;
use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        apiPrefix: 'api/v1',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            ForceJsonResponse::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // All API exceptions return the standard envelope: { success, data, message, errors }

        $exceptions->render(function (TierLimitException $e, Request $request) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $e->getMessage(),
                'errors' => null,
            ], 403);
        });

        $exceptions->render(function (ValidationException $e, Request $request) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        });

        $exceptions->render(function (AuthenticationException $e, Request $request) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Please log in to continue.',
                'errors' => null,
            ], 401);
        });

        $exceptions->render(function (ModelNotFoundException|NotFoundHttpException $e, Request $request) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'The requested resource was not found.',
                'errors' => null,
            ], 404);
        });

        $exceptions->render(function (HttpException $e, Request $request) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $e->getMessage() ?: 'An error occurred.',
                'errors' => null,
            ], $e->getStatusCode());
        });

        $exceptions->render(function (Throwable $e, Request $request) {
            $status = 500;
            $message = app()->hasDebugModeEnabled()
                ? $e->getMessage()
                : 'Something went wrong. Please try again later.';

            return response()->json([
                'success' => false,
                'data' => null,
                'message' => $message,
                'errors' => null,
            ], $status);
        });
    })->create();
