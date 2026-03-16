# Auth System

## Overview

Sanctum token-based auth. No session/cookie auth. Tokens never expire. Logout revokes ALL tokens for the user.

## Routes

```
POST   /api/v1/register   → AuthController::register   (public)
POST   /api/v1/login      → AuthController::login      (public)
POST   /api/v1/logout     → AuthController::logout     (auth:sanctum)
GET    /api/v1/me         → AuthController::me         (auth:sanctum)
PUT    /api/v1/me         → AuthController::update     (auth:sanctum)
```

## Flow

### Register
1. `RegisterRequest` validates: name (required), email (required, unique), password (required, min:8, confirmed)
2. `User::create()` — plan defaults to `free`
3. `$user->createToken('auth')` → returns plaintext token
4. Response 201: `{ user: UserResource, token: string }`

### Login
1. `LoginRequest` validates: email (required), password (required)
2. `Auth::attempt()` — returns 401 if invalid
3. `$user->createToken('auth')` → returns plaintext token
4. Response 200: `{ user: UserResource, token: string }`

### Logout
- `$user->tokens()->delete()` — revokes ALL tokens, not just current one
- Response 200

### Profile (GET /me)
- Returns `UserResource` of authenticated user

### Profile Update (PUT /me)
- `UpdateProfileRequest`: name (sometimes), email (sometimes, unique ignoring self)
- Password change NOT supported through this endpoint
- Returns updated `UserResource`

## Files

| File | Purpose |
|------|---------|
| `app/Http/Controllers/Api/V1/AuthController.php` | All auth endpoints |
| `app/Http/Requests/LoginRequest.php` | Login validation |
| `app/Http/Requests/RegisterRequest.php` | Registration validation |
| `app/Http/Requests/UpdateProfileRequest.php` | Profile update validation |
| `app/Http/Resources/UserResource.php` | User serialization: id, name, email, plan, timestamps |
| `app/Models/User.php` | Eloquent model with HasApiTokens, HasUuids |
| `config/sanctum.php` | Stateful domains, token settings |
| `config/auth.php` | Guards, providers config |

## User Model

```php
$fillable = ['name', 'email', 'password', 'plan']
$hidden   = ['password', 'remember_token']
casts:    { email_verified_at: datetime, password: hashed, plan: Plan::class }
relations: companies(): HasMany<Company>
traits:    HasApiTokens, HasFactory, HasUuids, Notifiable
```

## Sanctum Config

- Stateful domains: localhost, localhost:3000, 127.0.0.1 variants
- Token expiration: null (never)
- Guard: web

## Tests

`tests/Feature/AuthTest.php` — 13 tests:
- Register: success (201 + free plan), required fields, duplicate email, short password
- Login: success, invalid credentials, missing fields
- Logout: success (all tokens revoked), requires auth
- Me: returns profile, requires auth
- Update: name update, duplicate email rejection, requires auth

## Decisions

- Tokens never expire — simplicity for MVP, revisit for production
- Logout revokes ALL tokens — prevents stale token accumulation
- No password change endpoint — not needed for MVP
- No email verification — not needed for MVP
