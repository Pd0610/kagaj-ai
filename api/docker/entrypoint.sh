#!/bin/sh
set -e

# Run migrations on deploy
php /var/www/html/artisan migrate --force

# Cache config and routes (skip view:cache — API-only, no Blade views)
php /var/www/html/artisan config:cache
php /var/www/html/artisan route:cache

# Start supervisord
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
