# PowerShell script to start ComplyCrafter database with Docker Compose

Write-Host "🚀 Starting ComplyCrafter Database..." -ForegroundColor Cyan

# Check if docker-compose is available
try {
    docker-compose --version | Out-Null
} catch {
    Write-Host "❌ docker-compose not found. Please install Docker Compose." -ForegroundColor Red
    exit 1
}

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker first." -ForegroundColor Red
    exit 1
}

# Navigate to project root (assuming script is in database/ directory)
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath
Set-Location $projectRoot

# Start the database
Write-Host "📦 Building and starting database container..." -ForegroundColor Yellow
docker-compose -f docker-compose.database.yml up -d --build

# Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if database is healthy
$maxAttempts = 30
$attempt = 0
$ready = $false

while ($attempt -lt $maxAttempts) {
    try {
        docker exec complycrafter-db pg_isready -U comply 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database is ready!" -ForegroundColor Green
            $ready = $true
            break
        }
    } catch {
        # Continue trying
    }
    $attempt++
    Write-Host "   Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
    Start-Sleep -Seconds 2
}

if (-not $ready) {
    Write-Host "❌ Database failed to start. Check logs with: docker-compose -f docker-compose.database.yml logs db" -ForegroundColor Red
    exit 1
}

# Show connection info
Write-Host ""
Write-Host "📊 Database Connection Info:" -ForegroundColor Cyan
Write-Host "   Host: localhost"
Write-Host "   Port: 5432"
Write-Host "   Database: comply"
Write-Host "   Username: comply"
Write-Host "   Password: comply"
Write-Host ""
Write-Host "🔗 Connect with: docker exec -it complycrafter-db psql -U comply -d comply" -ForegroundColor Yellow
Write-Host "📋 View logs: docker-compose -f docker-compose.database.yml logs -f db" -ForegroundColor Yellow
Write-Host "🛑 Stop database: docker-compose -f docker-compose.database.yml down" -ForegroundColor Yellow
Write-Host ""

