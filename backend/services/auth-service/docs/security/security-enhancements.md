# Security Enhancements

## 🔒 **MEJORAS DE SEGURIDAD IMPLEMENTADAS**

### **1. Helmet.js - Headers de Seguridad**

Helmet.js ayuda a proteger la aplicación estableciendo varios headers HTTP relacionados con la seguridad:

#### **Headers Configurados:**
- **Content Security Policy (CSP)**: Previene ataques XSS
- **X-Frame-Options**: Previene clickjacking
- **X-Content-Type-Options**: Previene MIME sniffing
- **X-XSS-Protection**: Protección adicional contra XSS
- **Strict-Transport-Security (HSTS)**: Fuerza HTTPS
- **Referrer Policy**: Controla información de referrer
- **Permissions Policy**: Controla características del navegador

#### **Configuración:**
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Para Swagger
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Para Swagger
}));
```

### **2. CORS Mejorado**

Configuración de CORS con seguridad mejorada:

#### **Características:**
- **Orígenes específicos**: Solo permite orígenes configurados
- **Métodos permitidos**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Headers permitidos**: Content-Type, Authorization, X-Requested-With
- **Headers expuestos**: Rate limit headers
- **Credentials**: Habilitado para autenticación

#### **Configuración:**
```typescript
app.enableCors({
  origin: configService.get<string[]>('app.cors.origin'),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
});
```

### **3. Validación de Contraseñas Mejorada**

#### **Validadores Implementados:**

##### **@IsStrongPassword()**
- **Longitud mínima**: Configurable (default: 8 caracteres)
- **Mayúsculas**: Al menos una letra mayúscula
- **Minúsculas**: Al menos una letra minúscula
- **Números**: Al menos un número
- **Caracteres especiales**: Al menos un carácter especial
- **Patrones débiles**: Rechaza patrones comunes (123, abc, etc.)
- **Caracteres repetidos**: Rechaza más de 2 caracteres repetidos
- **Secuencias**: Rechaza secuencias (abc, 123, etc.)

##### **@IsNotCommonPassword()**
- **Lista de contraseñas comunes**: Rechaza 100+ contraseñas comunes
- **Incluye variaciones**: password1, password123, etc.

#### **Uso:**
```typescript
export class RegisterDto {
  @IsStrongPassword()
  @IsNotCommonPassword()
  password: string;
}
```

### **4. Interceptor de Seguridad**

#### **Funcionalidades:**
- **Logging de eventos de seguridad**: Login, logout, registros, etc.
- **Mascarado de datos sensibles**: Emails, contraseñas, tokens
- **Monitoreo de IPs**: Registro de IPs de origen
- **User Agent tracking**: Registro de navegadores/dispositivos
- **Tiempo de respuesta**: Medición de performance

#### **Eventos Registrados:**
- `request_started`: Inicio de request
- `request_completed`: Request exitoso
- `request_failed`: Request fallido
- `login_successful`: Login exitoso
- `login_failed`: Login fallido

### **5. Guard de Filtrado de IPs**

#### **Funcionalidades:**
- **Blacklist**: IPs bloqueadas
- **Whitelist**: IPs permitidas
- **Soporte CIDR**: 192.168.1.0/24
- **Soporte Wildcard**: 192.168.*.*
- **Logging**: Registro de intentos bloqueados

#### **Configuración:**
```env
# IPs bloqueadas
IP_BLACKLIST=192.168.1.100,10.0.0.0/8

# IPs permitidas (si está configurado, solo estas IPs pueden acceder)
IP_WHITELIST=127.0.0.1,::1,192.168.1.0/24
```

### **6. Configuración de Seguridad**

#### **Variables de Entorno:**

##### **Password Security:**
```env
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_NUMBERS=true
PASSWORD_REQUIRE_SPECIAL_CHARS=true
```

##### **Session Security:**
```env
MAX_CONCURRENT_SESSIONS=5
SESSION_TIMEOUT=3600000
REFRESH_TOKEN_ROTATION=true
```

##### **Logging Security:**
```env
LOG_FAILED_ATTEMPTS=true
LOG_SUCCESSFUL_LOGINS=true
LOG_PASSWORD_CHANGES=true
LOG_ACCOUNT_LOCKOUTS=true
MASK_SENSITIVE_DATA=true
```

##### **IP Control:**
```env
IP_WHITELIST=127.0.0.1,::1
IP_BLACKLIST=192.168.1.100
```

### **7. Headers de Seguridad Implementados**

#### **Headers Automáticos:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### **8. Protección contra Ataques Comunes**

#### **XSS (Cross-Site Scripting):**
- Content Security Policy
- X-XSS-Protection header
- Sanitización de entrada

#### **CSRF (Cross-Site Request Forgery):**
- CORS configurado correctamente
- Validación de origen

#### **Clickjacking:**
- X-Frame-Options: DENY
- Content Security Policy frame-ancestors

#### **MIME Sniffing:**
- X-Content-Type-Options: nosniff

#### **Brute Force:**
- Rate limiting por endpoint
- Rate limiting por IP
- Logging de intentos fallidos

### **9. Monitoreo y Logging**

#### **Eventos de Seguridad:**
```json
{
  "event": "login_failed",
  "method": "POST",
  "url": "/auth/login",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "statusCode": 401,
  "error": "Invalid credentials",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "auth-service",
  "environment": "production"
}
```

#### **Datos Mascarados:**
- **Emails**: `j***n@example.com`
- **Contraseñas**: `***MASKED***`
- **Tokens**: `***MASKED***`

### **10. Recomendaciones de Producción**

#### **Configuración de Producción:**
1. **Usar HTTPS**: Configurar certificados SSL/TLS
2. **Rate Limiting**: Configurar límites apropiados
3. **IP Whitelist**: Limitar acceso a IPs conocidas
4. **Logging**: Configurar logging centralizado
5. **Monitoreo**: Implementar alertas de seguridad
6. **Backup**: Backup regular de logs de seguridad
7. **Auditoría**: Revisión regular de logs

#### **Variables Críticas:**
```env
# Cambiar en producción
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### **11. Testing de Seguridad**

#### **Comandos de Testing:**
```bash
# Test de rate limiting
npm run test:rate-limit

# Test de validación de contraseñas
npm run test:unit

# Test de headers de seguridad
curl -I http://localhost:3001/auth/login
```

#### **Verificación de Headers:**
```bash
# Verificar headers de seguridad
curl -I http://localhost:3001/auth/login | grep -E "(X-|Strict-|Content-)"
```

### **12. Monitoreo Continuo**

#### **Métricas a Monitorear:**
- **Intentos de login fallidos**: Por IP y usuario
- **Rate limit excedido**: Por endpoint
- **IPs bloqueadas**: Intentos de acceso no autorizado
- **Errores de validación**: Contraseñas débiles, etc.
- **Tiempo de respuesta**: Performance y posibles ataques

#### **Alertas Recomendadas:**
- Más de 10 intentos de login fallidos por IP en 5 minutos
- Rate limit excedido consistentemente
- Nuevas IPs intentando acceder
- Errores de validación masivos
- Tiempo de respuesta anormalmente alto 