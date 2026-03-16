# Companies System

## Overview

Users own companies. Company CRUD with ownership-based authorization via policies. Tier limits enforced at service layer (Free = 1 company, Pro/Enterprise = unlimited).

## Routes

```
GET    /api/v1/companies          → CompanyController::index    (auth:sanctum)
POST   /api/v1/companies          → CompanyController::store    (auth:sanctum)
GET    /api/v1/companies/{id}     → CompanyController::show     (auth:sanctum)
PUT    /api/v1/companies/{id}     → CompanyController::update   (auth:sanctum)
DELETE /api/v1/companies/{id}     → CompanyController::destroy  (auth:sanctum)
```

## Flow

### Create
1. `StoreCompanyRequest` validates fields
2. Controller delegates to `CompanyService::create($user, $data)`
3. Service checks `TierService::canCreateCompany()` → throws `TierLimitException` if over limit
4. Controller catches `TierLimitException` → returns 403
5. On success → 201 with CompanyResource

### Read
- Index: `$user->companies()->latest()->get()` — only own companies
- Show: `Gate::authorize('view', $company)` — ownership check

### Update/Delete
- `Gate::authorize('update|delete', $company)` → policy checks `$user->id === $company->user_id`
- Update delegates to `CompanyService::update()`, returns fresh model
- Delete delegates to `CompanyService::delete()`

## Validation Rules

### Store
```
name:                required|string|max:255
name_ne:             nullable|string|max:255
type:                required|Rule::enum(CompanyType)
registration_number: nullable|string|max:100
pan_number:          nullable|string|max:50
address:             nullable|string|max:1000
```

### Update
Same fields but `name` and `type` use `sometimes|required`.

## Company Model

```php
$fillable = ['name', 'name_ne', 'type', 'registration_number', 'pan_number', 'address', 'user_id']
casts:    { type: CompanyType::class }
relations: user(): BelongsTo<User>
traits:    HasFactory, HasUuids
```

## CompanyType Enum

```
pvt_ltd, public_ltd, partnership, sole_proprietorship, ngo, cooperative
```
Each has a `label()` method returning English name.

## Policy (CompanyPolicy)

```
viewAny:  always true
view:     $user->id === $company->user_id
create:   always true (tier check is in service, not policy)
update:   $user->id === $company->user_id
delete:   $user->id === $company->user_id
```

Auto-discovered via Laravel conventions (no manual registration).

## Files

| File | Purpose |
|------|---------|
| `app/Http/Controllers/Api/V1/CompanyController.php` | CRUD endpoints, delegates to service |
| `app/Http/Requests/StoreCompanyRequest.php` | Create validation |
| `app/Http/Requests/UpdateCompanyRequest.php` | Update validation |
| `app/Http/Resources/CompanyResource.php` | id, name, name_ne, type, registration_number, pan_number, address, timestamps |
| `app/Models/Company.php` | Eloquent model |
| `app/Services/CompanyService.php` | Business logic: create (with tier check), update, delete |
| `app/Policies/CompanyPolicy.php` | Ownership-based authorization |

## Tests

`tests/Feature/CompanyTest.php` — 14 tests:
- Index: returns own companies only, requires auth
- Store: full create, required fields, invalid enum, requires auth
- Tier limits: Free capped at 1 (403 on 2nd), Pro uncapped
- Show: own vs other user (403)
- Update: own vs other user (403)
- Delete: own vs other user (403), requires auth
