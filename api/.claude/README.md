# KagajAI API — Knowledge Base

> Every subsystem documented. Read the relevant doc before working on that area.

## Subsystem Index

| Doc | What it covers | When to read |
|-----|---------------|--------------|
| [auth.md](auth.md) | Sanctum tokens, login/register/logout, user model, profile updates | Any auth task, user management, token handling |
| [companies.md](companies.md) | Company CRUD, policies, service layer, tier limits | Company features, ownership, authorization |
| [templates.md](templates.md) | Template engine, versions, schema/slots, seeding, premium locking | Template features, document generation prep |
| [database.md](database.md) | All migrations, table schemas, UUID strategy, relationships | New migrations, schema questions, FK relationships |
| [services.md](services.md) | TierService, CompanyService — business logic layer | Tier limits, plan enforcement, service patterns |
| [testing.md](testing.md) | Test patterns, factories, PHPUnit config, how to run | Writing tests, understanding coverage |
| [documents.md](documents.md) | Document generation, PDF pipeline, Puppeteer, tier enforcement | Document CRUD, PDF generation, download |
| [infrastructure.md](infrastructure.md) | Middleware, routing, API envelope, enums, exceptions, providers | App bootstrap, middleware, response format |

## Quick Facts

- **Framework**: Laravel 12, PHP 8.4
- **API prefix**: `/api/v1/` (set in `bootstrap/app.php`, not route files)
- **Auth**: Sanctum token-based (not session/cookie)
- **IDs**: UUID everywhere via `HasUuids` trait
- **Response envelope**: `{ success, data, message, errors }` via `ApiResponse` trait
- **DB**: PostgreSQL 16 (prod), SQLite in-memory (tests)
- **Quality**: PHPStan level 6 (Larastan), Pint (PSR-12), PHPUnit feature tests
