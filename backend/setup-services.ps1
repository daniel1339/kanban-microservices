# Script to configure all microservices
Write-Host "🚀 Configuring Kanban microservices..." -ForegroundColor Green

# Check if NestJS CLI is installed
Write-Host "📋 Checking NestJS CLI..." -ForegroundColor Yellow
try {
    nest --version
} catch {
    Write-Host "❌ NestJS CLI is not installed. Installing..." -ForegroundColor Red
    npm install -g @nestjs/cli
}

# Services to create
$services = @(
    "auth-service",
    "user-service", 
    "board-service",
    "list-service",
    "card-service",
    "notification-service",
    "file-service",
    "api-gateway"
)

# Create each service
foreach ($service in $services) {
    $servicePath = "services/$service"
    
    Write-Host "🔧 Configuring $service..." -ForegroundColor Cyan
    
    # Check if already exists
    if (Test-Path $servicePath) {
        Write-Host "⚠️  $service already exists, skipping..." -ForegroundColor Yellow
        continue
    }
    
    # Create service with NestJS CLI
    try {
        Set-Location "services"
        nest new $service --package-manager npm --strict --skip-git
        Set-Location ".."
        Write-Host "✅ $service created successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error creating ${service}: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "🎉 Microservices configuration completed!" -ForegroundColor Green
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Install dependencies: npm install" -ForegroundColor White
Write-Host "   2. Configure environment variables" -ForegroundColor White
Write-Host "   3. Start development: npm run dev:all" -ForegroundColor White