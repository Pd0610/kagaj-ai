<?php

namespace App\Services;

use App\Models\Template;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Process;

class DocumentRenderer
{
    /**
     * Render a template's html_body with slot data, wrapped in a base HTML shell.
     */
    public function render(Template $template, array $slotData): string
    {
        $body = Blade::render($template->html_body, $slotData);

        return $this->wrapInHtmlShell($body, $template->name_ne ?: $template->name_en);
    }

    /**
     * Generate a PDF from HTML using Puppeteer + Chromium.
     * This properly handles Devanagari conjuncts/ligatures unlike DOMPDF.
     */
    public function generatePdf(string $html, string $outputPath): void
    {
        $htmlPath = tempnam(sys_get_temp_dir(), 'kagaj_').'.html';
        file_put_contents($htmlPath, $html);

        try {
            $scriptPath = base_path('scripts/html-to-pdf.mjs');
            $result = Process::timeout(30)->run(
                ['node', $scriptPath, $htmlPath, $outputPath]
            );

            if ($result->failed()) {
                throw new \RuntimeException('PDF generation failed: '.$result->errorOutput());
            }
        } finally {
            @unlink($htmlPath);
        }
    }

    private function wrapInHtmlShell(string $body, string $title): string
    {
        return <<<HTML
        <!DOCTYPE html>
        <html lang="ne">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{$title}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Mukta', 'Noto Sans Devanagari', sans-serif;
                    font-size: 11pt;
                    line-height: 1.5;
                    color: #000;
                }

                .document {
                    max-width: 210mm;
                    margin: 0 auto;
                }

                .page {
                    margin-bottom: 1em;
                }

                h1, h2, h3, h4 {
                    font-family: 'Mukta', sans-serif;
                    font-weight: 700;
                    margin-bottom: 0.5em;
                }

                h2 { font-size: 14pt; text-align: center; }
                h3 { font-size: 12pt; text-align: center; }

                p { margin-bottom: 0.6em; text-align: justify; }

                .letterhead { text-align: center; margin-bottom: 1.2em; }
                .date { text-align: right; margin-bottom: 1em; }
                .addressee { margin-bottom: 1em; }
                .subject { margin-bottom: 0.8em; }

                .signature-block {
                    margin-top: 2em;
                    text-align: right;
                }
                .signature-block .name { font-weight: 700; }

                .resolution-header {
                    text-align: center;
                    margin-bottom: 1.2em;
                }

                .attendee-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1em 0;
                }
                .attendee-table th,
                .attendee-table td {
                    border: 1px solid #000;
                    padding: 6px 10px;
                    text-align: left;
                }
                .attendee-table th {
                    background-color: #f0f0f0;
                    font-weight: 700;
                }

                .attachments { margin: 1.5em 0; }
                .attachments ol { padding-left: 2em; }
                .attachments li { margin-bottom: 0.3em; }

                .new-credentials {
                    margin: 1em 0;
                    padding: 1em;
                    border: 1px solid #000;
                }

                .quorum, .agenda, .decisions, .attendees {
                    margin: 1em 0;
                }

                ol { padding-left: 2em; }
                ol li { margin-bottom: 0.5em; }
            </style>
        </head>
        <body>
            {$body}
        </body>
        </html>
        HTML;
    }
}
