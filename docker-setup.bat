@echo off
REM PublicSprint Docker Setup Script for Windows
REM This script helps set up the application for Docker deployment

echo.
echo ================================
echo PublicSprint Docker Setup
echo ================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo [OK] Docker and Docker Compose are installed
echo.

REM Check if .env exists
if not exist .env (
    echo [INFO] Creating .env file from .env.docker...
    copy .env.docker .env
    echo [OK] .env file created
    echo.
    echo [WARNING] IMPORTANT: Please edit .env and update these values:
    echo    - CLOUDINARY_CLOUD_NAME
    echo    - CLOUDINARY_API_KEY
    echo    - CLOUDINARY_API_SECRET
    echo    - PUSHER_APP_ID
    echo    - PUSHER_APP_KEY
    echo    - PUSHER_APP_SECRET
    echo    - DB_PASSWORD (change from default 'secret'^)
    echo.
    pause
) else (
    echo [OK] .env file already exists
)

echo.
echo [INFO] Building Docker images...
docker-compose build

echo.
echo [INFO] Starting services...
docker-compose up -d

echo.
echo [INFO] Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo [INFO] Generating application key...
docker-compose exec -T app php artisan key:generate --force

echo.
echo [INFO] Running database migrations...
docker-compose exec -T app php artisan migrate --force

echo.
echo [INFO] Creating storage link...
docker-compose exec -T app php artisan storage:link

echo.
echo [INFO] Optimizing application...
docker-compose exec -T app php artisan optimize

echo.
echo [OK] Setup complete!
echo.
echo Your application is running at:
echo    http://localhost:8080
echo.
echo Service Status:
docker-compose ps

echo.
echo Useful commands:
echo    View logs:           docker-compose logs -f app
echo    Stop services:       docker-compose down
echo    Restart services:    docker-compose restart
echo    Run artisan:         docker-compose exec app php artisan [command]
echo.
echo Happy coding!
echo.
pause
