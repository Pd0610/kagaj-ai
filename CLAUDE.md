# KagajAI — Project Instructions

> AI-powered government document generation platform for Nepal.

## Session Protocol — MANDATORY

All business intelligence lives in the auto memory directory (never in this repo).

### Start of Session
1. Read `memory/MEMORY.md` — quick context
2. Read latest `memory/sessions/YYYY-MM-DD-session-NN.md` — last session's full context
3. Check `memory/decisions/README.md` — what's been decided
4. Check `memory/research/` if relevant

### During Session
- Log every non-trivial decision with ID, reasoning, and alternatives
- Note every discussion point — casual conversations lead to decisions later
- Track open questions

### End of Session — MANDATORY
1. Create `memory/sessions/YYYY-MM-DD-session-NN.md` with:
   - **Summary**: 1-2 lines
   - **Key Decisions**: Each with ID (D7, D8...), reasoning, alternatives considered
   - **What We Did**: Actions taken
   - **What We Discussed**: Discussion points (even without decisions)
   - **Open Questions**: Unresolved for future
   - **For Next Session**: Concrete next steps
2. Update `memory/decisions/README.md` index if new decisions were made
3. Update `memory/MEMORY.md` status line if project phase changed

### Why This Matters
Surya has context between sessions. Jarvis doesn't. Session files ARE Jarvis's memory.

## Code Conventions

### General
- **Monorepo**: `api/` (Laravel) + `web/` (Next.js) in one repo (D17)
- **Dev env**: Sail for API stack (PHP 8.4, PostgreSQL 16, Redis 7), Next.js runs natively (Node 22)
- **API port**: 8080 (avoids conflict with wagering platform on 80)

### PHP / Laravel (`api/`)
- **API-only** — no Blade views, no Vite, no web routes
- **Enums**: PHP backed enums for all status/type fields (`App\Enums\*`)
- **API envelope**: Every response wraps in `{ success, data, message, errors }`
- **Money in paisa**: All amounts stored as integers (NPR * 100) — never floats
- **UUID routing**: Public URLs use UUIDs, internal joins use bigint IDs
- **HasUuid trait**: Auto-generates UUID on model creation, sets `getRouteKeyName` to `uuid`
- **ForceJsonResponse middleware**: All requests get JSON responses, never HTML
- **Rate limiting**: 60/min auth, 20/min public, 10/min chat
- **PHPStan level 6** via Larastan
- **Pint** for code style (ships with Laravel, PSR-12)
- **Namespace**: Controllers at `App\Http\Controllers\Api\V1\*`
- **Sanctum** for auth (token-based, `HasApiTokens` trait on User model)

### TypeScript / Next.js (`web/`)
- **Strict mode**: `strict: true`, `noUncheckedIndexedAccess: true`
- **App Router** with route groups: `(auth)`, `(dashboard)`, `chat/[uuid]`
- **API client**: `src/lib/api-client.ts` with typed envelope wrapper
- **Types**: `src/types/models.ts` mirrors Laravel models/enums
- **Import alias**: `@/*` maps to `./src/*`

### Testing
- **PHPUnit** for API tests (`sail test`)
- Feature tests use `RefreshDatabase` trait
- Auth tests cover: register, login, logout, me, update, validation, unauthorized

### Docker
- Root `docker-compose.yml` includes Sail via `include: [./api/compose.yaml]`
- Sail services: laravel.test, pgsql, redis, mailpit
- Next.js runs natively (`npm run dev` in `web/`)

### CI/CD
- `api.yml` — PHP 8.4, PostgreSQL service, Pint + PHPStan + PHPUnit (triggered by `api/**`)
- `web.yml` — Node 22, TypeScript check + ESLint + build (triggered by `web/**`)

## Rules
- **Business intelligence stays in memory/, never in git.** No business plans, competitive analysis, pricing strategy, or session logs in the repo.
- Every session gets a session file. No exceptions.
- Decisions are numbered and indexed.
- Research is saved, not repeated.
- When in doubt, check memory/ before asking Surya to repeat context.
