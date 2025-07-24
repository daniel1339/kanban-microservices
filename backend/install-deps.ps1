# Script to install dependencies in all microservices
Write-Host "📦 Installing dependencies in all microservices..." -ForegroundColor Green

# Services to install dependencies
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

# Install dependencies in each service
foreach ($service in $services) {
    $servicePath = "services/$service"
    
    Write-Host "🔧 Installing dependencies in $service..." -ForegroundColor Cyan
    
    # Check if service exists
    if (-not (Test-Path $servicePath)) {
        Write-Host "❌ $service not found, skipping..." -ForegroundColor Red
        continue
    }
    
    # Install dependencies
    try {
        Set-Location $servicePath
        
        # Install base dependencies
        npm install
        
        # Install specific dependencies for auth-service (Day 3 & 4)
        if ($service -eq "auth-service") {
            Write-Host "🔐 Installing auth-specific dependencies..." -ForegroundColor Yellow
            
            # Database dependencies
            npm install @nestjs/typeorm typeorm pg
            
            # Configuration dependencies
            npm install @nestjs/config
            
            # Validation dependencies
            npm install class-validator class-transformer
            
            # Security dependencies
            npm install bcryptjs @types/bcryptjs
            
            # JWT and Authentication dependencies (Day 4)
            npm install @nestjs/jwt @nestjs/passport passport passport-jwt @types/passport-jwt
            
            Write-Host "✅ Auth-specific dependencies installed" -ForegroundColor Green
        }
        
        Set-Location "../.."
        Write-Host "✅ Dependencies installed in $service" -ForegroundColor Green
    } catch {
        $errorMsg = $_.Exception.Message
        Write-Host "❌ Error installing dependencies in ${service}: ${errorMsg}" -ForegroundColor Red
        Set-Location "../.."
    }
}

Write-Host "🎉 Dependencies installation completed!" -ForegroundColor Green
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Configure environment variables (.env files)" -ForegroundColor White
Write-Host "   2. Start development environment: npm run dev:all" -ForegroundColor White
Write-Host "   3. Continue with Day 3: Auth Service setup" -ForegroundColor White