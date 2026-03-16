# Templates System

## Overview

Read-only template catalog. Templates are admin-seeded, not user-created. Each template has versioned schemas. Premium templates are locked for free-tier users. The `blade_template` field is server-side only — never exposed to clients.

## Routes

```
GET  /api/v1/templates           → TemplateController::index  (auth:sanctum)
GET  /api/v1/templates/{id}      → TemplateController::show   (auth:sanctum)
```

Read-only. No create/update/delete endpoints.

## Flow

### Index
1. Load all `is_active=true` templates with `latestPublishedVersion` relation
2. For each template: `is_locked = is_premium && !TierService::canAccessPremiumTemplates($user->plan)`
3. Return TemplateResource collection

### Show
Same is_locked decoration for a single template.

## Schema Structure

Each `TemplateVersion` has a `schema` JSON field containing slot definitions:

```json
{
  "slots": [
    {
      "name": "company_name",
      "type": "text",           // text | textarea | number | date | select
      "label": "Company Name",
      "label_ne": "कम्पनीको नाम",
      "required": true,
      "source": "company",      // optional — auto-fill from selected company
      "options": ["opt1", "opt2"] // optional — only for select type
    }
  ]
}
```

Slots with `source: 'company'` are auto-filled from the user's selected company data.

## Template Model

```php
$fillable = ['name', 'name_ne', 'category', 'description', 'description_ne', 'is_premium', 'is_active']
casts:    { category: TemplateCategory::class, is_premium: bool, is_active: bool }
relations:
  versions(): HasMany<TemplateVersion>
  latestPublishedVersion(): HasOne<TemplateVersion>  // whereNotNull('published_at')->orderByDesc('version')
```

## TemplateVersion Model

```php
$fillable = ['template_id', 'version', 'schema', 'blade_template', 'published_at']
casts:    { version: int, schema: 'array', published_at: 'datetime' }
relations: template(): BelongsTo<Template>
```

## TemplateCategory Enum

```
company_registration, tax_compliance, board_resolution, legal_agreement, hr_document, general
```
Each has `label()` (English) and `labelNe()` (Nepali) methods.

## Resources

### TemplateResource
Fields: id, name, name_ne, category, description, description_ne, is_premium, is_active, is_locked (whenHas), latest_schema (from relation), timestamps.

### TemplateVersionResource
Fields: id, template_id, version, schema, published_at, timestamps. **Excludes `blade_template`.**

## Seeded Templates

| Name | Category | Premium | Slot Count |
|------|----------|---------|------------|
| Board Resolution | board_resolution | No | 5 (2 from company) |
| Company Registration Form | company_registration | No | 6 |
| Tax Clearance Request | tax_compliance | No | 5 (2 from company) |
| Employment Agreement | hr_document | No | 6 (1 from company) |
| Partnership Deed | legal_agreement | No | 7 |

## Files

| File | Purpose |
|------|---------|
| `app/Http/Controllers/Api/V1/TemplateController.php` | Index/show with tier locking |
| `app/Http/Resources/TemplateResource.php` | Template serialization |
| `app/Http/Resources/TemplateVersionResource.php` | Version serialization (no blade_template) |
| `app/Models/Template.php` | Template model with version relations |
| `app/Models/TemplateVersion.php` | Versioned schema + blade |
| `app/Enums/TemplateCategory.php` | Category enum with labels |
| `database/seeders/TemplateSeeder.php` | Seeds 5 templates with published v1 |

## Tests

`tests/Feature/TemplateTest.php` — 9 tests:
- Index: lists active with schemas, excludes inactive
- Show: returns template with schema
- Tier lock: premium shows is_locked=true for free, false for pro
- Free templates always is_locked=false
- Auth required for index and show
