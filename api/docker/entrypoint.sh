#!/bin/sh
set -e

# Run migrations on deploy
php /var/www/html/artisan migrate --force

# Seed if database is empty (first deploy)
php /var/www/html/artisan db:seed --force 2>/dev/null || true

# Cache config/routes/views with runtime env vars
php /var/www/html/artisan config:cache
php /var/www/html/artisan route:cache
php /var/www/html/artisan view:cache

# Start supervisord
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
