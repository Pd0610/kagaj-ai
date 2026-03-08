# KagajAI — Dev Commands
# Usage: make <target>

# === Sail shortcuts ===
sail:
	cd api && ./vendor/bin/sail up -d

sail-down:
	cd api && ./vendor/bin/sail down

sail-restart:
	cd api && ./vendor/bin/sail down && ./vendor/bin/sail up -d

sail-logs:
	cd api && ./vendor/bin/sail logs -f

# === API (Laravel) ===
migrate:
	cd api && ./vendor/bin/sail artisan migrate

fresh:
	cd api && ./vendor/bin/sail artisan migrate:fresh --seed

seed:
	cd api && ./vendor/bin/sail artisan migrate:fresh --seed

test-api:
	cd api && ./vendor/bin/sail test

lint:
	cd api && ./vendor/bin/sail exec laravel.test ./vendor/bin/pint --test

lint-fix:
	cd api && ./vendor/bin/sail exec laravel.test ./vendor/bin/pint

stan:
	cd api && ./vendor/bin/sail exec laravel.test ./vendor/bin/phpstan analyse

routes:
	cd api && ./vendor/bin/sail artisan route:list --path=api/v1

tinker:
	cd api && ./vendor/bin/sail artisan tinker

# === Web (Next.js) ===
web:
	cd web && npm run dev

web-build:
	cd web && npm run build

web-lint:
	cd web && npm run lint

web-types:
	cd web && npx tsc --noEmit

# === Combined ===
dev: sail web

check: lint stan test-api web-types web-lint

.PHONY: sail sail-down sail-restart sail-logs migrate fresh seed test-api lint lint-fix stan routes tinker web web-build web-lint web-types dev check
