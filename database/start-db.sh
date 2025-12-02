#!/bin/bash

# Script to start ComplyCrafter database with Docker Compose

set -e

echo "🚀 Starting ComplyCrafter Database..."

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install Docker Compose."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Navigate to project root (assuming script is in database/ directory)
cd "$(dirname "$0")/.."

# Start the database
echo "📦 Building and starting database container..."
docker-compose -f docker-compose.database.yml up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check if database is healthy
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker exec complycrafter-db pg_isready -U comply &> /dev/null; then
        echo "✅ Database is ready!"
        break
    fi
    attempt=$((attempt + 1))
    echo "   Attempt $attempt/$max_attempts..."
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ Database failed to start. Check logs with: docker-compose -f docker-compose.database.yml logs db"
    exit 1
fi

# Show connection info
echo ""
echo "📊 Database Connection Info:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: comply"
echo "   Username: comply"
echo "   Password: comply"
echo ""
echo "🔗 Connect with: docker exec -it complycrafter-db psql -U comply -d comply"
echo "📋 View logs: docker-compose -f docker-compose.database.yml logs -f db"
echo "🛑 Stop database: docker-compose -f docker-compose.database.yml down"
echo ""

