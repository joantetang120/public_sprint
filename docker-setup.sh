#!/bin/bash

# PublicSprint Docker Setup Script
# This script helps set up the application for Docker deployment

set -e

echo "🚀 PublicSprint Docker Setup"
echo "=============================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.docker..."
    cp .env.docker .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and update these values:"
    echo "   - CLOUDINARY_CLOUD_NAME"
    echo "   - CLOUDINARY_API_KEY"
    echo "   - CLOUDINARY_API_SECRET"
    echo "   - PUSHER_APP_ID"
    echo "   - PUSHER_APP_KEY"
    echo "   - PUSHER_APP_SECRET"
    echo "   - DB_PASSWORD (change from default 'secret')"
    echo ""
    read -p "Press Enter after you've updated .env file..."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🏗️  Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "🔑 Generating application key..."
docker-compose exec -T app php artisan key:generate --force

echo ""
echo "📦 Running database migrations..."
docker-compose exec -T app php artisan migrate --force

echo ""
echo "🔗 Creating storage link..."
docker-compose exec -T app php artisan storage:link

echo ""
echo "🎨 Optimizing application..."
docker-compose exec -T app php artisan optimize

echo ""
echo "✅ Setup complete!"
echo ""
echo "📍 Your application is running at:"
echo "   http://localhost:8080"
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "📝 Useful commands:"
echo "   View logs:           docker-compose logs -f app"
echo "   Stop services:       docker-compose down"
echo "   Restart services:    docker-compose restart"
echo "   Run artisan:         docker-compose exec app php artisan <command>"
echo ""
echo "🎉 Happy coding!"
