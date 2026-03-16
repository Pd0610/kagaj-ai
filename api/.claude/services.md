# Services

## Overview

Business logic lives in services, not controllers. Controllers are thin — validate via Form Requests, delegate to services, serialize via Resources.

## TierService

**File**: `app/Services/TierService.php`

Static utility class. No constructor dependencies. Pure functions.

### Tier Limits

| Limit | Free | Pro | Enterprise |
|-------|------|-----|-----------|
| docs_per_month | 5 | unlimited | unlimited |
| companies | 1 | unlimited | unlimited |
| premium_templates | No | Yes | Yes |

### Methods

```php
static limits(Plan $plan): array           // Returns full limits array
static canCreateCompany(Plan, int): bool    // currentCount < limit
static canGenerateDocument(Plan, int): bool // currentMonthCount < limit (ready but unused — T5)
static canAccessPremiumTemplates(Plan): bool // Pro/Enterprise only
```

## CompanyService

**File**: `app/Services/CompanyService.php`

Injected into `CompanyController` via constructor DI.

### Methods

```php
create(User $user, array $data): Company
  // 1. Counts $user->companies()->count()
  // 2. Checks TierService::canCreateCompany()
  // 3. Throws TierLimitException if over limit
  // 4. Creates company with user_id set

update(Company $company, array $data): Company
  // Updates and returns $company->fresh()

delete(Company $company): void
```

## Pattern

```
Request → FormRequest (validation) → Controller (thin) → Service (business logic) → Model
                                                      ↘ throws TierLimitException
                                   Controller catches → ApiResponse::error(403)
```

## TierLimitException

**File**: `app/Exceptions/TierLimitException.php`

Empty exception class. Thrown by `CompanyService::create()`. Caught in `CompanyController::store()` and returned as a 403 with message from the exception.

## Adding New Services

Follow the same pattern:
1. Create service class in `app/Services/`
2. Inject via constructor DI in the controller
3. Move all business logic into service methods
4. Controller only: validates, delegates, serializes
5. Use `TierService` for plan-based feature gating
