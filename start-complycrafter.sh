#!/bin/bash

# ComplyCrafter Startup Script
# This script starts all necessary services for the application

set -e

PROJECT_ROOT="/Users/aghoresgwarprasadsingh/Desktop/OHA Systems/Comply Crafter/Comply-Crafter-code"

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║           🚀 Starting ComplyCrafter Application 🚀               ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is running
echo "📦 Step 1/4: Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo ""
    echo "Please start Docker Desktop and wait for it to be ready,"
    echo "then run this script again."
    echo ""
    exit 1
fi
echo "✅ Docker is running"
echo ""

# Start backend services
echo "🔧 Step 2/4: Starting backend services..."
cd "$PROJECT_ROOT/ops"
docker compose up -d

echo "⏳ Waiting for services to initialize (30 seconds)..."
sleep 30
echo "✅ Backend services started"
echo ""

# Check if services are running
echo "🔍 Step 3/4: Verifying backend services..."
SERVICES_OK=true

if docker compose ps | grep -q "db.*Up"; then
    echo "  ✅ Database (PostgreSQL) - Running"
else
    echo "  ❌ Database - Not running"
    SERVICES_OK=false
fi

if docker compose ps | grep -q "forms.*Up"; then
    echo "  ✅ Forms Service (FastAPI) - Running on http://localhost:8100"
else
    echo "  ❌ Forms Service - Not running"
    SERVICES_OK=false
fi

if docker compose ps | grep -q "gateway.*Up"; then
    echo "  ✅ Gateway Service - Running on http://localhost:8000"
else
    echo "  ⚠️  Gateway Service - Not running (optional)"
fi

echo ""

if [ "$SERVICES_OK" = false ]; then
    echo "❌ Some critical services failed to start!"
    echo "Check the logs with: cd ops && docker compose logs"
    exit 1
fi

# Instructions for frontend
echo "🌐 Step 4/4: Frontend Setup"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Backend is ready!"
echo ""
echo "To start the frontend:"
echo ""
echo "  1. Open a NEW terminal window"
echo ""
echo "  2. Run these commands:"
echo "     cd \"$PROJECT_ROOT/frontend\""
echo "     npm start"
echo ""
echo "  3. Wait for 'Compiled successfully' message (1-2 minutes)"
echo ""
echo "  4. Open your browser to:"
echo ""
echo "     🌐 http://localhost:4200"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Service URLs:"
echo "  • Frontend:       http://localhost:4200"
echo "  • Backend API:    http://localhost:8100"
echo "  • API Docs:       http://localhost:8100/docs"
echo "  • Gateway:        http://localhost:8000"
echo ""
echo "📋 Useful Commands:"
echo "  • View backend logs:  cd ops && docker compose logs -f"
echo "  • Stop backend:       cd ops && docker compose down"
echo "  • Restart backend:    cd ops && docker compose restart"
echo ""
echo "🎉 Backend is running! Start the frontend to complete setup."
echo ""

