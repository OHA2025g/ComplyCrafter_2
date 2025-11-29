# PowerShell script to run all migration files in order against local Docker database
$ErrorActionPreference = "Continue"

Write-Host "Running Database Migrations..." -ForegroundColor Cyan
Write-Host ""

$migrationsDir = Join-Path $PSScriptRoot "..\services\forms\migrations"
$migrations = Get-ChildItem -Path $migrationsDir -Filter "*.sql" | Where-Object { $_.Name -ne "all_combined.sql" } | Sort-Object Name

Write-Host "Found $($migrations.Count) migration files" -ForegroundColor Green
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($migration in $migrations) {
    $currentNum = $successCount + $failCount + 1
    Write-Host "[$currentNum/$($migrations.Count)] Running: $($migration.Name)" -ForegroundColor Yellow
    
    $content = Get-Content $migration.FullName -Raw
    $content | docker compose -f ops/docker-compose.yml exec -T db psql -U comply -d comply 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Success" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "  Failed" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "Summary: Success=$successCount, Failed=$failCount" -ForegroundColor Cyan
