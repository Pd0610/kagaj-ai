<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ConversationController;
use App\Http\Controllers\Api\V1\DocumentController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\SubscriptionController;
use App\Http\Controllers\Api\V1\TemplateController;
use App\Http\Controllers\Api\V1\UsageController;
use Illuminate\Support\Facades\Route;

// Public — auth
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::put('me', [AuthController::class, 'update']);
    });
});

// Public — templates
Route::middleware('throttle:public')->group(function () {
    Route::get('templates', [TemplateController::class, 'index'])->name('templates.index');
    Route::get('templates/categories', [TemplateController::class, 'categories'])->name('templates.categories');
    Route::get('templates/{template:slug}', [TemplateController::class, 'show'])->name('templates.show');
});

// Authenticated
Route::middleware('auth:sanctum')->group(function () {
    // Conversations
    Route::post('conversations', [ConversationController::class, 'store']);
    Route::get('conversations/{conversation:uuid}', [ConversationController::class, 'show']);
    Route::delete('conversations/{conversation:uuid}', [ConversationController::class, 'destroy']);
    Route::post('conversations/{conversation:uuid}/messages', [ConversationController::class, 'sendMessage'])
        ->middleware('throttle:chat');
    Route::post('conversations/{conversation:uuid}/confirm', [ConversationController::class, 'confirm']);

    // Documents
    Route::get('documents', [DocumentController::class, 'index']);
    Route::get('documents/{document:uuid}', [DocumentController::class, 'show']);
    Route::get('documents/{document:uuid}/preview', [DocumentController::class, 'preview']);
    Route::get('documents/{document:uuid}/download', [DocumentController::class, 'download']);
    Route::post('documents/{document:uuid}/regenerate', [DocumentController::class, 'regenerate']);
    Route::delete('documents/{document:uuid}', [DocumentController::class, 'destroy']);

    // Payments
    Route::post('payments/subscribe', [PaymentController::class, 'subscribe']);
    Route::post('payments/pay-per-doc', [PaymentController::class, 'payPerDoc']);
    Route::get('payments/history', [PaymentController::class, 'history']);

    // Subscriptions
    Route::get('subscriptions/current', [SubscriptionController::class, 'current']);
    Route::post('subscriptions/cancel', [SubscriptionController::class, 'cancel']);

    // Usage
    Route::get('usage/current', [UsageController::class, 'current']);
    Route::get('dashboard/stats', [UsageController::class, 'dashboardStats']);
});

// Payment verification (public but signature-verified)
Route::post('payments/verify', [PaymentController::class, 'verify'])
    ->middleware('throttle:public');
