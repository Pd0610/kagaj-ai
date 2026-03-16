# Documents Subsystem

## Overview

Document generation is KagajAI's core feature. Users pick a template, fill slots, and get a PDF.

Flow: `Template card → /documents/new?template={id} → Fill form → POST /documents → PDF generated → browser download`

## Model: `Document`

- **Table**: `documents`
- **Traits**: `HasUuids`, `HasFactory`
- **Columns**: `id` (UUID PK), `user_id`, `company_id` (nullable), `template_id`, `template_version_id`, `title`, `reference_number` (unique, `KAG-YYYY-NNNNN`), `slot_data` (JSON), `pdf_path` (nullable), `timestamps`
- **Relations**: `belongsTo(User, Company, Template, TemplateVersion)`
- **Scope**: `scopeCurrentMonth()` — filters to documents created this month (used for tier limits)

## DocumentService

Location: `app/Services/DocumentService.php`

Single public method: `generate(User, Template, array $slotData, ?Company)`

Steps:
1. Tier check via `TierService::canGenerateDocument()` → throws `TierLimitException`
2. Premium check → 403 if free user + premium template
3. Resolve latest published version → 422 if none
4. Validate required slots → `ValidationException` if missing (skips company-source slots)
5. Merge company data into slot values (convention-based field mapping)
6. Generate reference number: `KAG-{YYYY}-{NNNNN}`
7. Blade render template with merged slot data
8. Watermark for free tier (fixed-position, 40% opacity)
9. Puppeteer PDF generation
10. Create Document record

### Company Field Mapping

Convention-based: slot `name` → company column:
- `company_name` → `name`
- `company_name_ne` → `name_ne`
- `registration_number` → `registration_number`
- `pan_number` → `pan_number`
- `address` → `address`

## PDF Pipeline

- **Interface**: `App\Contracts\PdfGenerator` — `generate(string $html, string $outputPath): void`
- **Real impl**: `PuppeteerPdfGenerator` — calls `node scripts/html-to-pdf.mjs` via `Process::run()`, reads HTML from stdin, writes PDF to output path
- **Test impl**: `FakePdfGenerator` (in test file) — writes `%PDF-1.4 fake` to output path
- **Binding**: `AppServiceProvider` binds interface → `PuppeteerPdfGenerator`
- **Node script**: `scripts/html-to-pdf.mjs` — Puppeteer headless, A4, margins 20/20/15/15mm
- **Dependencies**: `scripts/package.json` — `puppeteer ^24.0.0`

## Routes

All require `auth:sanctum`:
- `POST /documents` — generate document (StoreDocumentRequest)
- `GET /documents` — list user's documents
- `GET /documents/{document}` — show single document
- `GET /documents/{document}/download` — download PDF (streamed, Content-Type: application/pdf)

## Authorization

- **StoreDocumentRequest**: `authorize()` verifies user owns the company (if provided)
- **DocumentPolicy**: `view` and `download` — `$document->user_id === $user->id`

## Tier Rules

- Free: 5 docs/month, no premium templates, watermark on PDF
- Pro/Enterprise: unlimited, premium access, no watermark

## Tests

`tests/Feature/DocumentTest.php` — 11 tests covering:
- Happy path (generate, list, show, download)
- Auth required
- Validation (invalid template, missing required slots)
- Company auto-fill
- Tier limits (5/month for free, premium template block)
- Quick Generate (no company)
