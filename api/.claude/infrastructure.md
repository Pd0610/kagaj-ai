# Infrastructure

## App Bootstrap

**File**: `bootstrap/app.php`

```php
->withRouting(
    api: routes/api.php,
    apiPrefix: 'api/v1',    // ALL routes under /api/v1/
)
->withMiddleware(function ($middleware) {
    $middleware->api(prepend: [ForceJsonResponse::class]);
})
```

- API prefix set here, NOT in route files
- `ForceJsonResponse` forces `Accept: application/json` on every request
- **No `statefulApi()`** — pure Bearer token auth only (no sessions, no CSRF)
- **CORS**: Framework default `HandleCors` middleware (`Access-Control-Allow-Origin: *`). No custom config needed.

## Providers

`bootstrap/providers.php` → only `AppServiceProvider` (currently empty).

## Routes

**File**: `routes/api.php`

```
# Public
GET    /health           → inline closure (returns 200)
POST   /register         → AuthController::register
POST   /login            → AuthController::login

# Authenticated (auth:sanctum)
POST   /logout           → AuthController::logout
GET    /me               → AuthController::me
PUT    /me               → AuthController::update
Resource /companies      → CompanyController (index, store, show, update, destroy)
GET    /templates         → TemplateController::index
GET    /templates/{id}    → TemplateController::show
```

## API Response Envelope

**File**: `app/Traits/ApiResponse.php`

Every response uses this format:
```json
{
  "success": true|false,
  "data": mixed|null,
  "message": "string",
  "errors": object|null
}
```

Methods:
- `success($data, $message, $status)` — auto-resolves JsonResource instances
- `error($message, $status, $errors)` — for error responses

## ForceJsonResponse Middleware

**File**: `app/Http/Middleware/ForceJsonResponse.php`

Sets `Accept: application/json` header on every request. Ensures Laravel's exception handler returns JSON for 401, 403, 422, 500 errors instead of HTML redirects.

## Enums

| Enum | File | Values |
|------|------|--------|
| Plan | `app/Enums/Plan.php` | free, pro, enterprise |
| CompanyType | `app/Enums/CompanyType.php` | pvt_ltd, public_ltd, partnership, sole_proprietorship, ngo, cooperative |
| TemplateCategory | `app/Enums/TemplateCategory.php` | company_registration, tax_compliance, board_resolution, legal_agreement, hr_document, general |

All are PHP 8.4 string-backed enums with `label()` methods. TemplateCategory also has `labelNe()` for Nepali.

## Exceptions

**Rule: Controllers NEVER catch exceptions for response formatting.** All exception→response mapping lives in `bootstrap/app.php` `withExceptions()`.

| Exception | File | Thrown by | Handled in |
|-----------|------|-----------|------------|
| TierLimitException | `app/Exceptions/TierLimitException.php` | CompanyService::create() | bootstrap/app.php → 403 |
| ValidationException | Framework | Form Requests | bootstrap/app.php → 422 |
| AuthenticationException | Framework | auth:sanctum middleware | bootstrap/app.php → 401 |
| ModelNotFoundException / NotFoundHttpException | Framework | Route model binding | bootstrap/app.php → 404 |
| HttpException | Framework | abort() calls | bootstrap/app.php → status from exception |
| Throwable (fallback) | Any | Anything uncaught | bootstrap/app.php → 500 (generic message in prod) |

## Config Notes

- `config/auth.php`: Default guard `web`, Eloquent provider with `User::class`
- `config/sanctum.php`: Stateful domains include localhost:3000, token expiration null
- `config/database.php`: PostgreSQL 16 default, SQLite for testing
- `config/logging.php`: Stack channel (daily + stderr)
- `config/mail.php`: Mailpit for local dev (port 1025)
