# ComplyCrafter Frontend Rebuild Script
# This script cleans and rebuilds the frontend with HTTPS fix

Write-Host "========================================"
Write-Host "  ComplyCrafter Frontend Rebuild"
Write-Host "  Fixing Mixed Content HTTPS Error"
Write-Host "========================================"
Write-Host ""

# Navigate to frontend directory
Set-Location -Path "frontend"

Write-Host "Step 1: Cleaning old build artifacts..."
# Remove old build files
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
    Write-Host "  Removed dist/"
}

if (Test-Path ".angular") {
    Remove-Item -Path ".angular" -Recurse -Force
    Write-Host "  Removed .angular/"
}

if (Test-Path "node_modules/.vite") {
    Remove-Item -Path "node_modules/.vite" -Recurse -Force
    Write-Host "  Removed vite cache"
}

if (Test-Path ".nx/cache") {
    Remove-Item -Path ".nx/cache" -Recurse -Force
    Write-Host "  Removed nx cache"
}

Write-Host ""
Write-Host "Step 2: Verifying environment files..."

# Check environment files
$envFile = "apps/portal/src/environments/environment.ts"
$envProdFile = "apps/portal/src/environments/environment.prod.ts"

if (Select-String -Path $envFile -Pattern "https://api.menindata.org" -Quiet) {
    Write-Host "  environment.ts configured for HTTPS"
} else {
    Write-Host "  ERROR: environment.ts not configured correctly!"
    exit 1
}

if (Select-String -Path $envProdFile -Pattern "https://api.menindata.org" -Quiet) {
    Write-Host "  environment.prod.ts configured for HTTPS"
} else {
    Write-Host "  ERROR: environment.prod.ts not configured correctly!"
    exit 1
}

Write-Host ""
Write-Host "Step 3: Building for production..."
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Build successful!"
} else {
    Write-Host "  Build failed!"
    exit 1
}

Write-Host ""
Write-Host "========================================"
Write-Host "  Build Complete!"
Write-Host "========================================"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. If using Docker, rebuild the container:"
Write-Host "   cd .."
Write-Host "   docker-compose -f docker-compose.frontend.yml build --no-cache"
Write-Host "   docker-compose -f docker-compose.frontend.yml up -d"
Write-Host ""
Write-Host "2. If deployed elsewhere, upload the contents of:"
Write-Host "   frontend/dist/apps/portal/"
Write-Host ""
Write-Host "3. Clear browser cache or use Ctrl+Shift+R"
Write-Host ""

