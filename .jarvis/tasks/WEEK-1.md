# Week 1 — Foundation & UX Redesign

> **Sprint**: MVP Week 1 of 4
> **Start**: 2026-03-15 (Session 03)
> **Goal**: Fresh codebase, core flow working — register → create company → pick template → generate PDF → download

---

## Hard Constraints

1. **Backend-first.** No frontend page gets built until its API exists and is tested.
2. **One model, one migration, one test.** Nothing ships without a feature test.
3. **No dead code.** If it's not used in Week 1, it doesn't exist yet.
4. **No UI without data.** Every page renders real API responses, never hardcoded mock data.
5. **Brand from day 1.** CSS tokens, fonts, spacing system set up in T1. Not bolted on later.
6. **Tier logic is backend-enforced.** Frontend shows limits, backend enforces them. Never trust the client.
7. **UUID primary keys everywhere.** No bigint IDs. No dual ID columns. (D23)

## Architecture Principles

- **SOLID everywhere.** Single-responsibility services. Controllers are thin — validate, delegate, respond.
- **DRY via services, not inheritance.** `DocumentService`, `TierService`, `CompanyService`.
- **No repository pattern.** Eloquent is the abstraction. Don't wrap it.
- **Form Requests for every endpoint.** Validation never lives in controllers.
- **API Resources for every response.** No raw model serialization.
- **Enums for all status/type fields.** PHP 8.4 backed enums.
- **One concern per migration.**

## Quality Gates (Every Task)

- [ ] PHPStan level 6 passes
- [ ] Pint passes (PSR-12)
- [ ] Feature tests cover happy path + auth + validation
- [ ] TypeScript strict mode, zero `any`
- [ ] ESLint zero warnings
- [ ] Next.js build succeeds

---

## Tasks

### T1 — Project Scaffold
**Status**: Pending
**Depends on**: Nothing

- Fresh Laravel 12 + Sanctum, API-only config
- Fresh Next.js 15 + TypeScript strict
- Monorepo: `api/` + `web/`, root `docker-compose.yml`
- Sail: PHP 8.4, PG 16, Redis 7
- CI: `api.yml` + `web.yml`
- Brand CSS tokens + Plus Jakarta Sans + Noto Sans Devanagari
- API client (`api-client.ts`) with typed envelope wrapper
- **Done when**: Both apps boot. `GET /api/health` returns 200. Web shows blank branded page.

### T2 — Auth System
**Status**: Pending
**Depends on**: T1

- User model: name, email, password, `plan` enum (free/pro/enterprise, default free)
- Registration: name, email, password — nothing else (D22)
- Login, logout, me, update profile
- Sanctum token auth
- `TierService` — knows limits per plan
- Feature tests: register, login, logout, me, validation, duplicate email
- Frontend: login + register pages, auth context, protected routes
- **Done when**: User can register, login, see plan. Tests pass.

### T3 — Company CRUD
**Status**: Pending
**Depends on**: T2

- Company model: name, name_ne, type (enum), registration_number, pan_number, address, user_id
- `CompanyPolicy` — user can only access own companies
- `CompanyService` — CRUD with tier limit check (1 free, unlimited pro)
- Endpoints: index, store, show, update, destroy
- Feature tests: CRUD + tier limit + authorization
- Frontend: `/companies` page (landing after login), company cards, add company form
- **Done when**: User can manage companies within tier limits. Tests pass.

### T4 — Template System
**Status**: Pending
**Depends on**: T2

- Template model: name, name_ne, category (enum), schema (JSON), is_premium, is_active
- TemplateVersion model: template_id, version, schema, blade_template, published_at
- Seeder: 5 free-tier templates
- `TemplatePolicy` — premium visible but generation blocked for free
- Endpoints: index (tier-aware), show
- Feature tests: list, premium visibility, access control
- Frontend: `/templates` catalog, category tabs, lock icon on premium
- **Done when**: Templates visible, premium locked. Tests pass.

### T5 — Document Generation (Core Flow)
**Status**: Pending
**Depends on**: T3, T4

- Document model: user_id, company_id (nullable per P2), template_version_id, slot_data, status (enum), file_path, reference_number
- `SlotValidator` — validates slot_data against template schema
- `DocumentRenderer` — Blade render + HTML shell
- `PdfService` — Puppeteer Node microservice (D13)
- `ReferenceNumberService` — KAG-YYYY-NNNNN, atomic increment
- `DocumentService` — orchestrates: validate → render → PDF → store
- `TierMiddleware` — checks doc count (5/month free)
- Watermark footer for free tier
- Endpoints: store, index, show, download
- Feature tests: generate, tier limit, validation, download
- Frontend: template form (dynamic from schema), PDF preview, download
- **Done when**: Full flow works — pick template → fill → generate → download. Tests pass.

### T6 — "Save as Company?" Flow
**Status**: Pending
**Depends on**: T5

- After doc generation without company → prompt to save as company
- Backend: extract company fields from slot_data, pre-fill company create
- Frontend: modal, pre-filled form, one-click save
- **Done when**: First doc creates company as byproduct (P3). No re-entry.

### T7 — Nav & Layout Polish
**Status**: Pending
**Depends on**: T3, T4, T5

- Dashboard layout: collapsible sidebar — Companies (primary), Templates, Documents
- Company-scoped nav: inside `/companies/[uuid]`, sidebar shows company context
- Empty states: encouraging, Nepali-first
- Loading: skeleton screens, not spinners
- Responsive: desktop-first, works on mobile
- **Done when**: App feels like a product, not a prototype.

---

## Dependency Graph

```
T1 → T2 → T3 → T5 → T6
           → T4 ↗    → T7
```

T3 and T4 can parallel after T2. T5 needs both. T6 and T7 are last.

## Risk

- **Puppeteer PDF microservice (T5)** — riskiest piece. If it blocks, stub with DOMPDF temporarily, swap later.

## NOT in Week 1

- AI conversational generation
- Payment integration
- Dark mode
- Command palette backend
- Document history/duplicate
- Company switcher
- Recent activity feed
