# Rate Limiting Configuration

## Variables de Entorno

### Configuración Global
```env
# Rate Limiting Configuration
THROTTLE_TTL=60                    # Tiempo de ventana en segundos (default: 60)
THROTTLE_LIMIT=10                  # Número máximo de requests por ventana (default: 10)
```

### Configuración Específica por Endpoint

#### Login
```env
THROTTLE_AUTH_LOGIN_TTL=300        # 5 minutos
THROTTLE_AUTH_LOGIN_LIMIT=5        # 5 intentos de login
```

#### Register
```env
THROTTLE_AUTH_REGISTER_TTL=3600    # 1 hora
THROTTLE_AUTH_REGISTER_LIMIT=3     # 3 registros por hora
```

#### Refresh Token
```env
THROTTLE_AUTH_REFRESH_TTL=60       # 1 minuto
THROTTLE_AUTH_REFRESH_LIMIT=10     # 10 refreshes por minuto
```

#### Validate Credentials
```env
THROTTLE_AUTH_VALIDATE_TTL=60      # 1 minuto
THROTTLE_AUTH_VALIDATE_LIMIT=20    # 20 validaciones por minuto
```

### Exclusiones
```env
THROTTLE_IGNORE_IPS=127.0.0.1,::1  # IPs que no aplican rate limiting
```

## Headers de Respuesta

El sistema incluye headers informativos en cada respuesta:

- `X-RateLimit-Limit`: Límite máximo de requests
- `X-RateLimit-Remaining`: Requests restantes en la ventana actual
- `X-RateLimit-Reset`: Timestamp cuando se resetea el contador

## Respuesta de Error

Cuando se excede el rate limit:

```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded. Please try again later.",
  "error": "Too Many Requests",
  "retryAfter": 60
}
```

## Implementación

### Decoradores Disponibles

- `@ThrottleLogin()` - Para endpoints de login
- `@ThrottleRegister()` - Para endpoints de registro
- `@ThrottleRefresh()` - Para endpoints de refresh token
- `@ThrottleValidate()` - Para endpoints de validación
- `@ThrottleStrict()` - Rate limiting estricto (3 requests/min)
- `@ThrottleLoose()` - Rate limiting relajado (100 requests/min)
- `@SkipThrottle()` - Saltar rate limiting

### Ejemplo de Uso

```typescript
@Post('login')
@Public()
@ThrottleLogin()
async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
  return this.authService.login(loginDto);
}
```

## Configuración en Producción

Para producción, se recomienda:

1. **Usar Redis** para almacenamiento distribuido de rate limits
2. **Configurar límites más estrictos** para endpoints sensibles
3. **Monitorear** las tasas de rechazo por rate limiting
4. **Implementar whitelist** para IPs confiables
5. **Configurar alertas** cuando se excedan los límites

## Testing

Para probar el rate limiting:

```bash
# Hacer múltiples requests rápidos
for i in {1..10}; do
  curl -X POST http://localhost:3001/auth/login \
    -H "Content-Type: application/json" \
    -d '{"emailOrUsername":"test@example.com","password":"password123"}'
done
```

El 6to request debería devolver un error 429. 