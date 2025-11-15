@echo off
echo ========================================
echo PublicSprint MVP+ Installation
echo ========================================
echo.

echo [1/6] Installing Composer dependencies...
call composer install
if %errorlevel% neq 0 (
    echo ERROR: Composer install failed!
    pause
    exit /b 1
)
echo.

echo [2/6] Installing NPM dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: NPM install failed!
    pause
    exit /b 1
)
echo.

echo [3/6] Installing Laravel Breeze with React...
call php artisan breeze:install react --dark
if %errorlevel% neq 0 (
    echo ERROR: Breeze installation failed!
    pause
    exit /b 1
)
echo.

echo [4/6] Running database migrations...
call php artisan migrate
if %errorlevel% neq 0 (
    echo ERROR: Migration failed!
    echo Make sure MySQL is running and database 'public_sprint' exists.
    pause
    exit /b 1
)
echo.

echo [5/6] Building frontend assets...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo [6/6] Clearing caches...
call php artisan config:clear
call php artisan cache:clear
call php artisan view:clear
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start the development server: composer dev
echo 2. Visit: http://localhost:8000
echo 3. Register an account and start building!
echo.
echo For detailed setup instructions, see SETUP.md
echo.
pause
