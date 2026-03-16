<?php

namespace App\Services;

use App\Contracts\PdfGenerator;
use Illuminate\Support\Facades\Process;
use RuntimeException;

class PuppeteerPdfGenerator implements PdfGenerator
{
    public function generate(string $html, string $outputPath): void
    {
        $scriptPath = base_path('scripts/html-to-pdf.mjs');

        $result = Process::input($html)
            ->timeout(30)
            ->run(['node', $scriptPath, $outputPath]);

        if ($result->failed()) {
            throw new RuntimeException(
                'PDF generation failed: '.$result->errorOutput()
            );
        }
    }
}
