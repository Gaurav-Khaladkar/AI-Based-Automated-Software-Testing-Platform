# =====================================================================
# AI-Based Automated Software Testing Platform - PowerShell Initializer
# =====================================================================
$RootDir = Split-Path -Parent $PSScriptRoot

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Initializing AI Testing Platform Workspace at: $RootDir" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$directories = @(
    "backend",
    "frontend",
    "ai-engine",
    "automation-engine",
    "test-engine",
    "database",
    "reports/templates",
    "docs",
    "ci"
)

foreach ($dir in $directories) {
    $fullPath = Join-Path $RootDir $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "[+] Created: $dir" -ForegroundColor Green
    } else {
        Write-Host "[✓] Exists:  $dir" -ForegroundColor DarkGray
    }
}

Write-Host "`n[SUCCESS] Platform directories initialized." -ForegroundColor Green
Write-Host "To launch the entire platform: docker compose up --build -d" -ForegroundColor Yellow
