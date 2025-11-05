# PowerShell script to run all migration files in order
param(
    [string]$Password
)

$migrationsDir = "services\forms\migrations"
$host = "31.97.207.166"
$port = "2701"
$user = "comply"
$database = "comply"

# Get password if not provided
if (-not $Password) {
    $securePassword = Read-Host "Enter password for user $user" -AsSecureString
    $Password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))
}

# Set PGPASSWORD environment variable
$env:PGPASSWORD = $Password

# Get all SQL files sorted by name
$migrationFiles = Get-ChildItem -Path $migrationsDir -Filter "*.sql" | Sort-Object Name

Write-Host "Found $($migrationFiles.Count) migration files to run" -ForegroundColor Green

foreach ($file in $migrationFiles) {
    $filePath = $file.FullName
    Write-Host "Running: $($file.Name)" -ForegroundColor Yellow
    
    psql -h $host -p $port -U $user -d $database -f $filePath
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error running $($file.Name)" -ForegroundColor Red
        $env:PGPASSWORD = ""
        exit 1
    }
    
    Write-Host "Completed: $($file.Name)" -ForegroundColor Green
}

# Clear password from environment
$env:PGPASSWORD = ""

Write-Host "All migrations completed successfully!" -ForegroundColor Green

