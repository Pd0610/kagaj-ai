# Testing

## Setup

- **Framework**: PHPUnit
- **DB**: SQLite in-memory (`DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:`)
- **Password hashing**: `BCRYPT_ROUNDS=4` for speed
- **Cache/Queue/Session**: array/sync/array

## Running Tests

```bash
cd api
./vendor/bin/phpunit                    # all tests
./vendor/bin/phpunit --filter=AuthTest  # specific test class
./vendor/bin/phpunit --filter=test_user_can_register  # specific test
```

## Static Analysis

```bash
cd api
./vendor/bin/phpstan analyse            # PHPStan level 6
./vendor/bin/pint                       # Code formatting (PSR-12)
./vendor/bin/pint --test                # Check without fixing
```

## Test Structure

All tests in `tests/Feature/` — no unit tests currently.

| Test File | Tests | What it covers |
|-----------|-------|---------------|
| `AuthTest.php` | 13 | Register, login, logout, me, update profile |
| `CompanyTest.php` | 14 | CRUD, ownership auth, tier limits |
| `TemplateTest.php` | 9 | Index, show, premium locking, auth |
| **Total** | **36** | |

## Test Patterns

### Base Setup
All feature tests use `RefreshDatabase` trait. No shared state between tests.

### Auth Helper
```php
$user = User::factory()->create();
$this->actingAs($user);              // Sets auth for subsequent requests
```

### API Assertions
```php
$response->assertStatus(201);
$response->assertJsonStructure(['success', 'data', 'message']);
$response->assertJson(['success' => true]);
$response->assertJsonPath('data.name', 'Expected Name');
```

### Testing Tier Limits
```php
$user = User::factory()->create();  // Free plan by default
// Create one company (allowed)
$this->actingAs($user)->postJson('/api/v1/companies', $data)->assertStatus(201);
// Second company should fail
$this->actingAs($user)->postJson('/api/v1/companies', $data)->assertStatus(403);
```

### Testing Auth Required
```php
$this->getJson('/api/v1/companies')->assertStatus(401);  // No actingAs
```

## Factories

See [database.md](database.md) for factory definitions and states.

## Writing New Tests

Pattern for every endpoint:
1. **Happy path**: correct data → expected response
2. **Auth required**: unauthenticated → 401
3. **Validation**: missing/invalid fields → 422
4. **Authorization**: other user's resource → 403
5. **Tier limits**: if applicable → 403 with message
