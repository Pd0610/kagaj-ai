# KagajAI

> AI-powered government document generation platform for Nepal.

## Architecture

- **Monorepo**: `api/` (Laravel 12) + `web/` (Next.js 15) — D17
- **Dev env**: Sail (PHP 8.4, PostgreSQL 16, Redis 7) + native Node 22
- **API port**: 8080
- **ID strategy**: UUID primary keys everywhere. No bigint. No dual columns. `HasUuids` trait. — D23
- **API envelope**: `{ success, data, message, errors }` on every response
- **Money**: Paisa (integer, NPR × 100). Never floats.
- **Auth**: Sanctum token-based
- **PDF**: Puppeteer Node microservice — D13

## Code Standards

- **DRY via services.** Thin controllers → Form Requests → Services → API Resources.
- **SOLID.** Single-responsibility services. No god classes.
- **Enums for all status/type fields.** PHP 8.4 backed enums (`App\Enums\*`).
- **Form Requests on every endpoint.** Validation never in controllers.
- **API Resources on every response.** No raw model serialization.
- **No dead code.** If nothing calls it, delete it.

## Quality Gates

Every commit must pass:
- PHPStan level 6 (Larastan)
- Pint (PSR-12)
- PHPUnit feature tests (happy path + auth + validation)
- TypeScript strict (`strict: true`, `noUncheckedIndexedAccess: true`)
- ESLint zero warnings
- Next.js production build

## Knowledge Base

Each subsystem is documented in `.claude/` directories. **Read the relevant doc before working on that area** — no need to explore the codebase from scratch.

- **`api/.claude/README.md`** — API knowledge index (auth, companies, templates, database, services, testing, infrastructure)
- **`web/.claude/README.md`** — Web knowledge index (auth, routing, components, api-client, styling)

**Read before working**: Read the relevant doc before touching that subsystem. Zero exploration needed.

**Update after completing**: When a task changes any subsystem, update its `.claude/` doc in the same commit. New files, new routes, schema changes, new components — all must be reflected. If a subsystem doc doesn't exist yet, create one and add it to the README index.

## Stack-Specific Conventions

- `api/CLAUDE.md` — Laravel patterns, migrations, testing
- `web/CLAUDE.md` — Next.js patterns, components, brand system

## Frontend Design Rules

- **Brand guidelines are mandatory.** Read `~/Workspace/claude-skills/kagaj-ai/features/brand-guidelines.md` before any UI work. It is the definitive reference.
- **Invoke `/ui-ux-pro-max` skill** before designing any page, component, or layout. No ad-hoc design decisions.
- **Use `web/CLAUDE.md`** for all frontend conventions — tokens, spacing, typography, component specs.
- **All colors via CSS tokens.** `bg-primary`, `text-muted-foreground`, `bg-primary-subtle` — never raw Tailwind (`gray-100`, `slate-200`).
- **Warm cream background** (`bg-background`), white cards (`bg-card`). Never `bg-white` for page backgrounds.
- **Gold accent sparingly.** Upgrade CTAs, decorative dividers. Never as text on light backgrounds.
- **Verify visually.** Screenshot with Playwright after building any UI. Don't trust code alone.

## Rules

- **Business intelligence stays in memory/, never in git.** No business plans, pricing, competitive analysis.
- **Backend-first.** No frontend page without a working, tested API behind it.
- **Tier logic is backend-enforced.** Frontend shows limits, backend enforces them.
- **No premature abstraction.** Build for what exists today, not what might exist tomorrow.
- **Brand from day 1.** Use CSS tokens. Never hardcode colors.
