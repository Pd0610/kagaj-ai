#!/bin/sh
set -e

# Run migrations on deploy
php /var/www/html/artisan migrate --force

# Seed templates if table is empty (idempotent)
php /var/www/html/artisan db:seed --class=TemplateSeeder --force 2>/dev/null || true

# Cache config and routes (skip view:cache — API-only, no Blade views)
php /var/www/html/artisan config:cache
php /var/www/html/artisan route:cache

# Start supervisord
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
