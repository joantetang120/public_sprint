#!/bin/bash

# Exit on error, but continue for non-critical failures
set -e

echo "========================================="
echo "Starting PublicSprint application..."
echo "========================================="
echo ""

# Debug: Check if env vars are available
echo "DEBUG: Checking environment variables..."
env | grep -E "^(APP_|DB_|PUSHER_)" | head -5 || echo "No environment variables found!"
echo ""

# Print environment info
echo "Environment: ${APP_ENV:-NOT_SET}"
echo "Database: ${DB_CONNECTION:-NOT_SET}"
echo "APP_KEY: ${APP_KEY:0:20}..." 
echo ""

# Wait for database to be ready
if [ "$DB_CONNECTION" = "pgsql" ]; then
    echo "Waiting for PostgreSQL..."
    echo "Host: $DB_HOST:$DB_PORT"
    echo "Database: $DB_DATABASE"
    
    # Check if database variables are set
    if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_DATABASE" ]; then
        echo "ERROR: Database environment variables not set!"
        echo "Please configure PostgreSQL database in Railway"
        echo "See RAILWAY_MYSQL_SETUP.md for instructions"
        exit 1
    fi
    
    # Wait for PostgreSQL to be ready
    RETRIES=30
    until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
        echo "PostgreSQL is unavailable - sleeping (retries left: $RETRIES)"
        sleep 2
        RETRIES=$((RETRIES-1))
    done
    
    if [ $RETRIES -eq 0 ]; then
        echo "ERROR: Could not connect to PostgreSQL after 60 seconds"
        exit 1
    fi
    
    echo "✓ PostgreSQL is up and ready"
    
elif [ "$DB_CONNECTION" = "mysql" ]; then
    echo "Configuring MySQL connection..."
    echo "Host: $DB_HOST:$DB_PORT"
    echo "Database: $DB_DATABASE"
    
    # Check if database variables are set
    if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_DATABASE" ]; then
        echo "ERROR: Database environment variables not set!"
        echo "Please configure MySQL database in Railway"
        echo "See RAILWAY_MYSQL_SETUP.md for instructions"
        exit 1
    fi
    
    # Try to connect to MySQL but don't fail if it's not ready yet
    # Laravel will handle reconnection attempts
    echo "Testing MySQL connection..."
    if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" -e "SELECT 1" > /dev/null 2>&1; then
        echo "✓ MySQL is up and ready"
    else
        echo "⚠ MySQL connection test failed, but continuing anyway"
        echo "Laravel will attempt to connect when needed"
    fi
    
elif [ "$DB_CONNECTION" = "sqlite" ]; then
    echo "WARNING: Using SQLite database"
    echo "This is NOT recommended for production!"
    echo "Please configure PostgreSQL or MySQL in Railway"
    echo "See RAILWAY_MYSQL_SETUP.md for instructions"
fi

# Create storage directories if they don't exist
echo "Setting up storage directories..."
mkdir -p /var/www/html/storage/framework/cache/data
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/bootstrap/cache

# Set proper permissions
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

# Clear any existing caches first
echo "Clearing existing caches..."
php artisan config:clear || echo "Config clear failed (may not exist yet)"
php artisan route:clear || echo "Route clear failed (may not exist yet)"
php artisan view:clear || echo "View clear failed (may not exist yet)"

# Cache configuration
echo "Caching configuration..."
php artisan config:cache || {
    echo "ERROR: Config cache failed!"
    exit 1
}
php artisan route:cache || echo "Route cache skipped (no routes cached)"
php artisan view:cache || echo "View cache skipped"

# Run migrations
echo "Running database migrations..."
if php artisan migrate --force --no-interaction 2>&1; then
    echo "✓ Migrations completed successfully"
else
    echo "⚠ Migrations failed - database may not be accessible yet"
    echo "Application will start anyway. Check logs if issues persist."
fi

# Create storage link if it doesn't exist
if [ ! -L /var/www/html/public/storage ]; then
    echo "Creating storage link..."
    php artisan storage:link
fi

# Clear and optimize
echo "Optimizing application..."
php artisan optimize

echo ""
echo "========================================="
echo "Application setup complete!"
echo "Starting Nginx and PHP-FPM..."
echo "========================================="
echo ""
echo "Nginx will listen on 0.0.0.0:8080"
echo "Access logs: /var/log/nginx/access.log"
echo "Error logs: /var/log/nginx/error.log"
echo "PHP-FPM logs: /var/log/php-fpm.log"
echo ""

# Test PHP configuration
echo "Testing PHP configuration..."
php -v
php -m | head -20
echo ""

# Check if Vite build exists
echo "Checking Vite build..."
if [ -f "/var/www/html/public/build/manifest.json" ]; then
    echo "✓ Vite manifest found"
    ls -lh /var/www/html/public/build/ | head -10
else
    echo "⚠ WARNING: Vite manifest NOT found!"
    echo "This will cause 500 errors"
    ls -la /var/www/html/public/
fi
echo ""

# Start supervisor (which starts nginx and php-fpm)
# Tail logs in background to see errors
tail -f /var/log/nginx/error.log 2>/dev/null &
exec /usr/bin/supervisord -c /etc/supervisord.conf
