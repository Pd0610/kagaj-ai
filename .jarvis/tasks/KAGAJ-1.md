# KAGAJ-1 — Form-Based Document Generation Pipeline

**Role**: Senior Full-Stack Engineer
**Worktree**: main (single repo)
**Directory**: `~/Workspace/kagaj-ai/`

## What Already Exists (DO NOT BUILD)

- **Auth system** — Sanctum auth, register/login/logout/me/update. 9 tests passing.
- **Template model + migration** — `templates` table with `schema` JSON, `html_body`, slug routing. 3 seeded templates.
- **TemplateController** — list/search/show endpoints working with TemplateResource.
- **Document model + migration** — `documents` table with `slot_data` JSON, `pdf_path`, status enum.
- **DocumentController** — exists but all methods return `TODO`.
- **ConversationController** — exists but all methods return `TODO`. **DO NOT TOUCH** — AI chat is deferred.
- **Frontend** — Next.js 15, Tailwind 4, auth pages exist, landing page exists.
- **Enums** — DocumentStatus (draft/generating/completed/failed), Language (en/ne).

## What You're Building

### Backend (Laravel API)

1. **Install Spatie Laravel PDF v2** with DOMPDF driver (zero external deps)
   - `composer require spatie/laravel-pdf`
   - Configure for DOMPDF driver
   - Download and bundle Mukta font (Devanagari support) in `public/fonts/`

2. **Template Rendering Service** (`app/Services/DocumentRenderer.php`)
   - Takes a Template + slot_data → renders `html_body` as Blade string → returns HTML
   - Use `Blade::render($template->html_body, $slotData)` for inline Blade rendering
   - Wrap output in a base HTML shell with Mukta font, A4 styling, proper Nepali text support

3. **Slot Validation Service** (`app/Services/SlotValidator.php`)
   - Validates submitted slot_data against template's `schema.slots`
   - Checks: required fields present, type validation, repeatable min/max items
   - Returns structured validation errors

4. **Implement DocumentController** methods:
   - `store(Request)` — validate slot_data against template schema → create document (status=draft) → render HTML → generate PDF via Spatie → save to `storage/app/documents/{uuid}.pdf` → update document (status=completed, pdf_path) → return document
   - `index()` — list auth user's documents, paginated, with template relationship
   - `show(Document)` — return document with slot_data + template info
   - `preview(Document)` — return rendered HTML (for iframe preview)
   - `download(Document)` — return PDF file download
   - `destroy(Document)` — soft delete, only own documents

5. **Update TemplateResource** — ensure `html_body` is NOT exposed in API responses

6. **Add `POST /api/v1/documents` route** — for creating documents (accepts `template_slug` + `slot_data` + `language`)

### Frontend (Next.js)

7. **API client** (`src/lib/api.ts`)
   - Fetch wrapper with base URL (`http://localhost:8000/api/v1`)
   - Auth token management (store Sanctum token in localStorage/cookie)
   - Typed request/response interfaces

8. **Templates browse page** (`src/app/(dashboard)/templates/page.tsx`)
   - Grid of template cards (name_en, name_ne, description, category badge)
   - Category filter tabs
   - Search bar
   - Click → navigate to `/templates/[slug]`

9. **Template detail + document form** (`src/app/(dashboard)/templates/[slug]/page.tsx`)
   - Fetch template with schema via `GET /api/v1/templates/{slug}`
   - Dynamically render form fields from `schema.slots`:
     - `text`, `text_ne`, `text_en` → `<input type="text">`
     - `textarea`, `textarea_ne` → `<textarea>`
     - `date_bs` → text input with BS date format hint
     - `email` → `<input type="email">`
     - `phone` → `<input type="tel">`
     - `number` → `<input type="number">`
     - `registration_no` → `<input type="text">`
     - `repeatable` → dynamic list with add/remove buttons, renders nested `fields`
   - Group fields by `schema.groups` with section headers (label_ne + label_en)
   - Order by `display_order`
   - Pre-fill `default` values where specified
   - Submit → `POST /api/v1/documents` → show preview/download

10. **Document preview + download page** (`src/app/(dashboard)/documents/[uuid]/page.tsx`)
    - Show rendered HTML in iframe (from preview endpoint)
    - Download PDF button
    - Back to templates button

11. **My Documents page** (`src/app/(dashboard)/documents/page.tsx`)
    - List of user's generated documents
    - Show: title, template name, created date, status
    - Click → document detail page
    - Delete button

## What You're NOT Touching

- `ConversationController` — AI chat is deferred (no API key budget)
- `PaymentController`, `SubscriptionController`, `UsageController` — monetization is later
- Template versioning — no `template_versions` table, use existing `version` column
- Admin template CRUD — templates are seeded for now
- Watermarking — skip for MVP

## Context & Decisions

- **PDF engine**: Spatie Laravel PDF v2 with DOMPDF driver. Pure PHP, no Chromium/Node needed.
  - Original architecture said Puppeteer — we're simplifying for MVP.
  - DOMPDF handles CSS 2.1 + some CSS3. Keep template HTML/CSS simple.
  - Devanagari support: DOMPDF can handle Unicode text with proper font embedding.
- **No AI**: Instead of conversational chat, users fill a structured form rendered from the template's slot schema. The schema already has all the field definitions, labels, groups, and ordering.
- **Blade inline rendering**: Templates store `html_body` as a Blade template string in the DB. Use `Blade::render()` to compile it with slot data. This avoids filesystem Blade files for now.
- **Font**: Bundle Mukta font (Google Fonts, OFL license). Download woff2 files to `public/fonts/`. Reference in template base CSS.
- **Existing template schemas**: The seeder has 3 templates. The `company-userid-password-change` template has a complete schema with groups, display_order, repeatable fields, and full HTML body. Use this as the reference for how forms should render.
- **Document storage**: Local filesystem at `storage/app/documents/{uuid}.pdf`. No S3 for MVP.

## Docs to Read

- Spatie Laravel PDF docs: https://spatie.be/docs/laravel-pdf/v2/introduction
- Existing seeder: `api/database/seeders/TemplateSeeder.php` — has full schema + HTML examples
- Existing models: `api/app/Models/Template.php`, `api/app/Models/Document.php`

## Acceptance Criteria

- [ ] `composer require spatie/laravel-pdf` installed and configured
- [ ] POST `/api/v1/documents` creates a document with valid slot_data and generates a PDF
- [ ] GET `/api/v1/documents` lists the authenticated user's documents
- [ ] GET `/api/v1/documents/{uuid}/preview` returns rendered HTML
- [ ] GET `/api/v1/documents/{uuid}/download` returns the PDF file
- [ ] Slot validation rejects missing required fields with clear error messages
- [ ] Repeatable fields (like `board_attendees`) can be added/removed in the form
- [ ] Frontend: user can browse templates, fill form, preview HTML, download PDF
- [ ] The `company-userid-password-change` template generates a proper 2-page Nepali document
- [ ] Nepali (Devanagari) text renders correctly in the PDF
- [ ] All existing tests still pass (`php artisan test`)
