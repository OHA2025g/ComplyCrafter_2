# Simple script to run all migrations
$env:PGPASSWORD = Read-Host "Enter password for user comply" -AsSecureString
$securePassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($env:PGPASSWORD))
$env:PGPASSWORD = $securePassword

Get-ChildItem -Path "services\forms\migrations" -Filter "*.sql" | Sort-Object Name | ForEach-Object {
    Write-Host "Running: $($_.Name)"
    psql -h 31.97.207.166 -p 2701 -U comply -d comply -f $_.FullName
}

$env:PGPASSWORD = ""




