# Quick development script for Kanban
Write-Host "🚀 Starting Kanban development environment..." -ForegroundColor Green

# Function to check if Docker is running
function Test-DockerRunning {
    try {
        docker ps > $null 2>&1
        return $true
    } catch {
        return $false
    }
}

# Function to check if a port is in use
function Test-PortInUse {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Check Docker
Write-Host "🐳 Checking Docker..." -ForegroundColor Yellow
if (-not (Test-DockerRunning)) {
    Write-Host "❌ Docker is not running. Start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check ports
Write-Host "🔍 Checking ports..." -ForegroundColor Yellow
$ports = @(5433, 6380, 4566)
foreach ($port in $ports) {
    if (Test-PortInUse $port) {
        Write-Host "⚠️  Port $port is in use" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Port $port available" -ForegroundColor Green
    }
}

# Start infrastructure services
Write-Host "📦 Starting infrastructure services..." -ForegroundColor Cyan
try {
    docker-compose -f ../docker-compose.dev.yml up -d
    Write-Host "✅ Infrastructure services started" -ForegroundColor Green
} catch {
    Write-Host "❌ Error starting services: $_" -ForegroundColor Red
    exit 1
}

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service status
Write-Host "🔍 Checking service status..." -ForegroundColor Yellow
docker-compose -f ../docker-compose.dev.yml ps

# Configure AWS local (optional)
Write-Host "🤔 Do you want to configure AWS local resources? (y/n)" -ForegroundColor Cyan
$response = Read-Host
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "🔧 Configuring AWS local resources..." -ForegroundColor Cyan
    try {
        & ../setup-local-aws.ps1
        Write-Host "✅ AWS resources configured" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error configuring AWS: $_" -ForegroundColor Red
    }
}

Write-Host "🎉 Development environment ready!" -ForegroundColor Green
Write-Host "📝 Available URLs:" -ForegroundColor Yellow
Write-Host "   - PostgreSQL: localhost:5433" -ForegroundColor White
Write-Host "   - Redis: localhost:6380" -ForegroundColor White
Write-Host "   - LocalStack: localhost:4566" -ForegroundColor White
Write-Host "   - API Gateway: localhost:3000 (when developed)" -ForegroundColor White
Write-Host "   - Auth Service: localhost:3001 (when developed)" -ForegroundColor White

Write-Host "🚀 To start development:" -ForegroundColor Cyan
Write-Host "   npm run dev:all" -ForegroundColor White 