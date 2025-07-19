# 🔗 Endpoints - Auth Service

## 📋 **RESUMEN DE ENDPOINTS**

### **🔐 Autenticación**
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Login de usuarios
- `POST /auth/refresh` - Renovación de tokens
- `POST /auth/logout` - Logout de usuarios
- `POST /auth/validate` - Validación de credenciales
- `GET /auth/profile` - Perfil de usuario

### **🏥 Health & Status**
- `GET /health` - Health check del servicio
- `GET /api` - Documentación Swagger

---

## 🔐 **ENDPOINTS DE AUTENTICACIÓN**

### **POST /auth/register**
**Descripción**: Registro de nuevos usuarios

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "username": "usuario123",
  "password": "Contraseña123!",
  "confirmPassword": "Contraseña123!"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "username": "usuario123",
    "is_verified": false,
    "created_at": "2024-01-01T12:00:00.000Z"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "expiresIn": 900
}
```

**Rate Limiting**: 3 registros por hora
**Validación**: Contraseña fuerte, email único, username único

---

### **POST /auth/login**
**Descripción**: Login de usuarios existentes

**Request Body:**
```json
{
  "emailOrUsername": "usuario@ejemplo.com",
  "password": "Contraseña123!"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "username": "usuario123",
    "is_verified": true,
    "last_login_at": "2024-01-01T12:00:00.000Z"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "expiresIn": 900
}
```

**Rate Limiting**: 5 intentos por 5 minutos
**Validación**: Credenciales correctas, cuenta no bloqueada

---

### **POST /auth/refresh**
**Descripción**: Renovación de access token

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response (200):**
```json
{
  "accessToken": "nuevo-jwt-token",
  "refreshToken": "nuevo-refresh-token",
  "expiresIn": 900
}
```

**Rate Limiting**: 10 refreshes por minuto
**Validación**: Token válido, no expirado, no revocado

---

### **POST /auth/logout**
**Descripción**: Logout y revocación de tokens

**Headers:**
```
Authorization: Bearer jwt-token
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

**Rate Limiting**: 20 requests por minuto
**Validación**: Token válido

---

### **POST /auth/validate**
**Descripción**: Validación de credenciales sin login

**Request Body:**
```json
{
  "emailOrUsername": "usuario@ejemplo.com",
  "password": "Contraseña123!"
}
```

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "username": "usuario123"
  }
}
```

**Rate Limiting**: 20 validaciones por minuto
**Validación**: Credenciales correctas

---

### **GET /auth/profile**
**Descripción**: Obtener perfil del usuario autenticado

**Headers:**
```
Authorization: Bearer jwt-token
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "username": "usuario123",
    "first_name": "Juan",
    "last_name": "Pérez",
    "phone": "+1234567890",
    "avatar_url": "https://example.com/avatar.jpg",
    "is_verified": true,
    "created_at": "2024-01-01T12:00:00.000Z",
    "last_login_at": "2024-01-01T12:00:00.000Z"
  }
}
```

**Rate Limiting**: 100 requests por minuto
**Validación**: Token válido

---

## 🏥 **ENDPOINTS DE HEALTH**

### **GET /health**
**Descripción**: Health check del servicio

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "auth-service",
  "version": "1.0.0",
  "uptime": 3600,
  "database": "connected",
  "cache": "connected"
}
```

---

## 📊 **CÓDIGOS DE ERROR**

### **400 Bad Request**
```json
{
  "statusCode": 400,
  "message": ["error1", "error2"],
  "error": "Bad Request",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/auth/register"
}
```

### **401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/auth/login"
}
```

### **403 Forbidden**
```json
{
  "statusCode": 403,
  "message": "Access denied",
  "error": "Forbidden",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/auth/profile"
}
```

### **429 Too Many Requests**
```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded. Please try again later.",
  "error": "Too Many Requests",
  "retryAfter": 60,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/auth/login"
}
```

---

## 🔒 **SEGURIDAD**

### **Headers de Seguridad**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`
- `Content-Security-Policy: default-src 'self'`

### **Rate Limiting Headers**
- `X-RateLimit-Limit`: Límite máximo
- `X-RateLimit-Remaining`: Requests restantes
- `X-RateLimit-Reset`: Timestamp de reset

### **Performance Headers**
- `X-Response-Time`: Tiempo de respuesta en ms
- `X-Request-ID`: Identificador único del request

---

## 🧪 **TESTING**

### **Usuarios de Prueba**
```json
{
  "admin": {
    "email": "admin@example.com",
    "username": "admin",
    "password": "password123"
  },
  "user": {
    "email": "user@example.com",
    "username": "user",
    "password": "password123"
  },
  "test": {
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }
}
```

### **Comandos de Testing**
```bash
# Test de endpoints
npm run test:unit

# Test de integración
npm run test:integration

# Test de rate limiting
npm run test:rate-limit

# Todos los tests
npm run test:all
```

---

## 📚 **DOCUMENTACIÓN ADICIONAL**

- **Swagger UI**: http://localhost:3001/api
- **OpenAPI Spec**: http://localhost:3001/api-json
- **Testing Guide**: [docs/testing/testing-guide.md](../testing/testing-guide.md)
- **Security Guide**: [docs/security/security-enhancements.md](../security/security-enhancements.md) 