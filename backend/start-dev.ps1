# Script to start all microservices in development mode
Write-Host "🚀 Starting all microservices in development mode..." -ForegroundColor Green

# Services to start
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

# Start each service in a new PowerShell window
foreach ($service in $services) {
    $servicePath = "services/$service"
    
    Write-Host "🔧 Starting $service..." -ForegroundColor Cyan
    
    # Check if service exists
    if (-not (Test-Path $servicePath)) {
        Write-Host "❌ $service not found, skipping..." -ForegroundColor Red
        continue
    }
    
    # Start service in new window
    try {
        $command = "cd '$servicePath' && npm run start:dev"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
        Write-Host "✅ $service started in new window" -ForegroundColor Green
        Start-Sleep -Seconds 2  # Wait a bit between services
    } catch {
        $errorMsg = $_.Exception.Message
        Write-Host "❌ Error starting ${service}: ${errorMsg}" -ForegroundColor Red
    }
}

Write-Host "🎉 All microservices started!" -ForegroundColor Green
Write-Host "📝 Services running on:" -ForegroundColor Yellow
Write-Host "   - API Gateway: http://localhost:3000" -ForegroundColor White
Write-Host "   - Auth Service: http://localhost:3001" -ForegroundColor White
Write-Host "   - User Service: http://localhost:3002" -ForegroundColor White
Write-Host "   - Board Service: http://localhost:3003" -ForegroundColor White
Write-Host "   - List Service: http://localhost:3004" -ForegroundColor White
Write-Host "   - Card Service: http://localhost:3005" -ForegroundColor White
Write-Host "   - Notification Service: http://localhost:3006" -ForegroundColor White
Write-Host "   - File Service: http://localhost:3007" -ForegroundColor White 