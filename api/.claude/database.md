# Database Schema

## Overview

PostgreSQL 16 in production, SQLite in-memory for tests. All domain tables use UUID primary keys. Laravel standard tables (cache, jobs, sessions) use default types.

## Tables

### users
```sql
uuid       id                  PK
string     name
string     email               UNIQUE
timestamp  email_verified_at   NULLABLE
string     password
string     plan                DEFAULT 'free'
string     remember_token      NULLABLE
timestamps
```
Migration: `0001_01_01_000000`

Also creates:
- `password_reset_tokens`: email (PK), token, created_at
- `sessions`: string id (PK), foreignUuid user_id, ip_address, user_agent, payload, last_activity (indexed)

### companies
```sql
uuid       id                  PK
string     name
string     name_ne             NULLABLE
string     type
string     registration_number NULLABLE
string     pan_number          NULLABLE
text       address             NULLABLE
foreignUuid user_id            FK → users (CASCADE DELETE)
timestamps
```
Migration: `2026_03_15_134240`

### templates
```sql
uuid       id                  PK
string     name
string     name_ne             NULLABLE
string     category
text       description         NULLABLE
text       description_ne      NULLABLE
boolean    is_premium          DEFAULT false
boolean    is_active           DEFAULT true
timestamps
```
Migration: `2026_03_15_100000`

### template_versions
```sql
uuid       id                  PK
foreignUuid template_id        FK → templates (CASCADE DELETE)
uint       version
json       schema
text       blade_template
timestamp  published_at        NULLABLE
timestamps
UNIQUE(template_id, version)
```
Migration: `2026_03_15_100001`

### personal_access_tokens (Sanctum)
```sql
bigint     id                  PK (auto-increment, NOT uuid)
uuidMorphs tokenable           (tokenable_type, tokenable_id)
text       name
string(64) token               UNIQUE
text       abilities            NULLABLE
timestamp  last_used_at        NULLABLE
timestamp  expires_at          NULLABLE, INDEXED
timestamps
```
Migration: `2026_03_15_073220`

Uses `uuidMorphs` (not regular `morphs`) to support UUID primary keys on tokenable models.

### Standard Laravel Tables
- `cache` / `cache_locks` — standard cache tables
- `jobs` / `job_batches` / `failed_jobs` — standard queue tables (bigint IDs)

## Relationships

```
User  ──1:N──  Company         (user_id FK, cascade delete)
User  ──1:N──  PersonalAccessToken (via Sanctum morph)
Template ──1:N── TemplateVersion (template_id FK, cascade delete)
```

## UUID Strategy

- All domain models use `HasUuids` trait + `$table->uuid('id')->primary()`
- Foreign keys use `foreignUuid()` with cascade delete
- Sanctum tokens table uses `uuidMorphs` for polymorphic relation
- No dual-column (id + uuid) pattern — UUID IS the primary key

## Seeding

`DatabaseSeeder`:
1. Creates dev user: `test@example.com` / `password` (Free plan)
2. Runs `TemplateSeeder` → 5 templates with published v1 schemas

## Factories

| Factory | Key States |
|---------|-----------|
| UserFactory | Default: Free plan. States: `pro()`, `enterprise()`, `unverified()` |
| CompanyFactory | Default: random type. States: `pvtLtd()` |
| TemplateFactory | Default: active, not premium. States: `premium()`, `inactive()` |
| TemplateVersionFactory | Default: v1, unpublished. States: `published()` |
