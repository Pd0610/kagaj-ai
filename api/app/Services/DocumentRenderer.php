<?php

namespace App\Services;

use App\Models\Template;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\Blade;

class DocumentRenderer
{
    /**
     * Ensure Mukta font is registered in DOMPDF's font cache.
     * This is idempotent — DOMPDF skips if already cached.
     */
    public function ensureFontsRegistered(): void
    {
        $options = new Options;
        $options->setIsRemoteEnabled(true);
        $options->setChroot(base_path());
        $dompdf = new Dompdf($options);
        $fontMetrics = $dompdf->getFontMetrics();

        if ($fontMetrics->getFont('Mukta')) {
            return;
        }

        $fontMetrics->registerFont(
            ['family' => 'Mukta', 'style' => 'normal', 'weight' => 'normal'],
            public_path('fonts/Mukta-Regular.ttf')
        );

        $fontMetrics->registerFont(
            ['family' => 'Mukta', 'style' => 'normal', 'weight' => 'bold'],
            public_path('fonts/Mukta-Bold.ttf')
        );
    }

    /**
     * Render a template's html_body with slot data, wrapped in a base HTML shell.
     */
    public function render(Template $template, array $slotData): string
    {
        $this->ensureFontsRegistered();

        $body = Blade::render($template->html_body, $slotData);

        return $this->wrapInHtmlShell($body, $template->name_ne ?: $template->name_en);
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
                    font-size: 12pt;
                    line-height: 1.6;
                    color: #000;
                    padding: 20mm;
                }

                .document {
                    max-width: 210mm;
                    margin: 0 auto;
                }

                .page {
                    margin-bottom: 2em;
                }

                h1, h2, h3, h4 {
                    font-family: 'Mukta', sans-serif;
                    font-weight: 700;
                    margin-bottom: 0.5em;
                }

                h2 { font-size: 16pt; text-align: center; }
                h3 { font-size: 14pt; text-align: center; }

                p { margin-bottom: 0.8em; text-align: justify; }

                .letterhead { text-align: center; margin-bottom: 2em; }
                .date { text-align: right; margin-bottom: 1.5em; }
                .addressee { margin-bottom: 1.5em; }
                .subject { margin-bottom: 1em; }

                .signature-block {
                    margin-top: 3em;
                    text-align: right;
                }
                .signature-block .name { font-weight: 700; }

                .resolution-header {
                    text-align: center;
                    margin-bottom: 2em;
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
                    margin: 1.5em 0;
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
