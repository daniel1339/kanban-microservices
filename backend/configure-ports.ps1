# Script to configure ports for all microservices
Write-Host "🔧 Configuring ports for all microservices..." -ForegroundColor Green

# Service configurations (name, port, main.ts path)
$services = @(
    @{ Name = "auth-service"; Port = 3001; Path = "services/auth-service/src/main.ts" },
    @{ Name = "user-service"; Port = 3002; Path = "services/user-service/src/main.ts" },
    @{ Name = "board-service"; Port = 3003; Path = "services/board-service/src/main.ts" },
    @{ Name = "list-service"; Port = 3004; Path = "services/list-service/src/main.ts" },
    @{ Name = "card-service"; Port = 3005; Path = "services/card-service/src/main.ts" },
    @{ Name = "notification-service"; Port = 3006; Path = "services/notification-service/src/main.ts" },
    @{ Name = "file-service"; Port = 3007; Path = "services/file-service/src/main.ts" },
    @{ Name = "api-gateway"; Port = 3000; Path = "services/api-gateway/src/main.ts" }
)

foreach ($service in $services) {
    $mainPath = $service.Path
    
    $serviceName = $service.Name
    $servicePort = $service.Port
    Write-Host "🔧 Configuring $serviceName on port $servicePort..." -ForegroundColor Cyan
    
    if (-not (Test-Path $mainPath)) {
        $serviceName = $service.Name
        Write-Host "❌ $serviceName main.ts not found, skipping..." -ForegroundColor Red
        continue
    }
    
    # Read current content
    $content = Get-Content $mainPath -Raw
    
    # Replace port configuration
    $newContent = $content -replace 'await app\.listen\(process\.env\.PORT \?\? \d+\)', "await app.listen(process.env.PORT || $servicePort)"
    $newContent = $newContent -replace 'console\.log\(`🚀 .* running on port \$\{port\}`\)', "console.log(`🚀 $serviceName running on port $servicePort`)"
    
    # Add CORS if not present
    if ($newContent -notmatch 'app\.enableCors') {
        $corsConfig = @"
  
  // Configure CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });
  
"@
        $newContent = $newContent -replace 'const app = await NestFactory\.create\(AppModule\);', "const app = await NestFactory.create(AppModule);$corsConfig"
    }
    
    # Write back to file
    Set-Content $mainPath $newContent -Encoding UTF8
    Write-Host "✅ $serviceName configured successfully" -ForegroundColor Green
}

Write-Host "🎉 All microservices configured!" -ForegroundColor Green
Write-Host "📝 Next: Start development environment with 'npm run dev:all'" -ForegroundColor Yellow 