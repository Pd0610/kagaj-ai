# KagajAI

AI-powered government document generation platform for Nepal.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for Laravel Sail)
- [Node.js 22+](https://nodejs.org/) (for Next.js — runs natively, not in Docker)

## Quick Start

### 1. Clone and setup

```bash
git clone git@github.com:Pd0610/kagaj-ai.git
cd kagaj-ai
```

### 2. Start the API

```bash
# Copy environment file
cp api/.env.example api/.env

# Start Docker containers (PostgreSQL, Redis, Mailpit, PHP)
cd api && ./vendor/bin/sail up -d

# Generate app key
./vendor/bin/sail artisan key:generate

# Run migrations and seed test data
./vendor/bin/sail artisan migrate:fresh --seed

# Verify it works
./vendor/bin/sail artisan route:list --path=api/v1
```

The API is now running at **http://localhost:8080**.

### 3. Start the frontend

```bash
cd web
cp .env.local.example .env.local
npm install
npm run dev
```

The frontend is now running at **http://localhost:3000**.

### 4. Verify everything

```bash
# API health check
curl http://localhost:8080/up

# Templates endpoint (JSON envelope)
curl http://localhost:8080/api/v1/templates

# Register a test user
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Password123!","password_confirmation":"Password123!"}'
```

## Project Structure

```
kagaj-ai/
├── api/                  # Laravel 12 (PHP 8.4, Sail)
│   ├── app/
│   │   ├── Enums/        # PHP backed enums
│   │   ├── Http/Controllers/Api/V1/
│   │   ├── Models/       # 8 MVP models
│   │   └── Traits/       # ApiResponse, HasUuid
│   ├── database/
│   │   ├── migrations/   # 8 MVP tables
│   │   └── seeders/      # Template seed data
│   └── routes/api.php    # 27 API routes
├── web/                  # Next.js 15 (TypeScript, Tailwind)
│   └── src/
│       ├── app/          # App Router pages
│       ├── lib/          # API client
│       └── types/        # TypeScript types
├── docker-compose.yml    # Root compose (includes Sail)
├── Makefile              # Dev commands
└── CLAUDE.md             # Code conventions
```

## Dev Commands (Makefile)

```bash
make sail              # Start Docker containers
make sail-down         # Stop containers
make fresh             # Reset DB: migrate + seed
make test-api          # Run PHP tests
make lint              # Check code style (Pint)
make lint-fix          # Fix code style
make stan              # Run PHPStan static analysis
make routes            # List API routes
make web               # Start Next.js dev server
make web-types         # TypeScript check
make web-lint          # ESLint check
make check             # Run all checks (lint + stan + tests + types + eslint)
```

## Services & Ports

| Service      | Port  | URL                          |
|-------------|-------|------------------------------|
| API         | 8080  | http://localhost:8080        |
| Next.js     | 3000  | http://localhost:3000        |
| PostgreSQL  | 54320 | localhost:54320              |
| Redis       | 63790 | localhost:63790              |
| Mailpit UI  | 8026  | http://localhost:8026        |

> Ports are offset to avoid conflicts with other projects. Change them in `api/.env`.

## API Authentication

Token-based auth via Laravel Sanctum:

```bash
# Register → get token
POST /api/v1/auth/register  { name, email, password, password_confirmation }

# Login → get token
POST /api/v1/auth/login     { email, password }

# Use token in subsequent requests
Authorization: Bearer {token}
```

All responses follow the envelope format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "errors": null
}
```

## Running Tests

```bash
# API tests (9 auth tests)
cd api && ./vendor/bin/sail test

# PHPStan static analysis
cd api && ./vendor/bin/sail exec laravel.test ./vendor/bin/phpstan analyse

# TypeScript check
cd web && npx tsc --noEmit
```

## Port Conflicts

If ports conflict with other running services, edit `api/.env`:

```env
APP_PORT=8080              # API (default: 80)
FORWARD_DB_PORT=54320      # PostgreSQL (default: 5432)
FORWARD_REDIS_PORT=63790   # Redis (default: 6379)
FORWARD_MAILPIT_PORT=10250 # Mailpit SMTP (default: 1025)
FORWARD_MAILPIT_DASHBOARD_PORT=8026  # Mailpit UI (default: 8025)
```

Then restart: `cd api && ./vendor/bin/sail down && ./vendor/bin/sail up -d`
