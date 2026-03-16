<?php

namespace App\Providers;

use App\Contracts\PdfGenerator;
use App\Services\PuppeteerPdfGenerator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(PdfGenerator::class, PuppeteerPdfGenerator::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
