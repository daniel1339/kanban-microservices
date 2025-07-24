# 🔗 Endpoints - Auth Service

## 📋 **ENDPOINTS SUMMARY**

### **🔐 Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token renewal
- `POST /api/auth/logout` - User logout
- `POST /api/auth/validate` - Credential validation
- `GET /api/auth/profile` - User profile

### **🏥 Health & Status**
- `GET /health` - Service health check
- `GET /api` - Swagger documentation

---

## 🔐 **AUTHENTICATION ENDPOINTS**

### **POST /api/auth/register**
**Description**: New user registration

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "user123",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "user123",
    "is_verified": false,
    "created_at": "2024-01-01T12:00:00.000Z"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "expiresIn": 900
}
```

**Rate Limiting**: 3 registrations per hour
**Validation**: Strong password, unique email, unique username

---

### **POST /api/auth/login**
**Description**: Login for existing users

**Request Body:**
```json
{
  "emailOrUsername": "user@example.com",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "user123",
    "is_verified": true,
    "last_login_at": "2024-01-01T12:00:00.000Z"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "expiresIn": 900
}
```

**Rate Limiting**: 5 attempts per 5 minutes
**Validation**: Correct credentials, account not blocked

---

### **POST /api/auth/refresh**
**Description**: Access token renewal

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response (200):**
```json
{
  "accessToken": "new-jwt-token",
  "refreshToken": "new-refresh-token",
  "expiresIn": 900
}
```

**Rate Limiting**: 10 attempts per hour
**Validation**: Valid refresh token, not expired

---

### **POST /api/auth/logout**
**Description**: User logout and token invalidation

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response (200):**
```json
{
  "message": "Logout successful",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Rate Limiting**: 10 attempts per hour
**Authentication**: Required

---

### **POST /api/auth/validate**
**Description**: Credential validation

**Request Body:**
```json
{
  "emailOrUsername": "user@example.com",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "isValid": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "user123"
  }
}
```

**Response (200) - Invalid:**
```json
{
  "isValid": false,
  "message": "Invalid credentials"
}
```

**Rate Limiting**: 10 attempts per 5 minutes
**Validation**: Credential verification

---

### **GET /api/auth/profile**
**Description**: Get user profile information

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "user123",
  "is_verified": true,
  "created_at": "2024-01-01T12:00:00.000Z",
  "updated_at": "2024-01-01T12:00:00.000Z",
  "last_login_at": "2024-01-01T12:00:00.000Z"
}
```

**Rate Limiting**: 100 requests per hour
**Authentication**: Required

---

## 🏥 **HEALTH & STATUS ENDPOINTS**

### **GET /health**
**Description**: Service health check

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "development"
}
```

**Rate Limiting**: None
**Authentication**: Not required

---

### **GET /api**
**Description**: Swagger API documentation

**Response**: HTML page with interactive API documentation

**Rate Limiting**: None
**Authentication**: Not required

---

## 📊 **ERROR RESPONSES**

### **400 Bad Request**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/auth/register",
  "details": [
    {
      "field": "email",
      "message": "Email must be valid"
    }
  ]
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

### **404 Not Found**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/auth/profile"
}
```

### **409 Conflict**
```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "error": "Conflict",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/auth/register"
}
```

### **422 Unprocessable Entity**
```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "error": "Unprocessable Entity",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/auth/register",
  "details": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

### **429 Too Many Requests**
```json
{
  "statusCode": 429,
  "message": "Too many requests",
  "error": "Too Many Requests",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/auth/login",
  "retryAfter": 300
}
```

### **500 Internal Server Error**
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/auth/register"
}
```

---

## 🔒 **SECURITY FEATURES**

### **Rate Limiting**
- **Registration**: 3 attempts per hour
- **Login**: 5 attempts per 5 minutes
- **Refresh**: 10 attempts per hour
- **Profile**: 100 requests per hour
- **General**: 100 requests per minute

### **Password Requirements**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### **JWT Configuration**
- **Access Token**: 15 minutes
- **Refresh Token**: 7 days
- **Algorithm**: HS256
- **Issuer**: Auth Service

### **CORS Configuration**
- **Origin**: Configurable via environment
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Authorization, Content-Type
- **Credentials**: true

---

## 📈 **PERFORMANCE METRICS**

### **Response Times**
- **Health Check**: < 50ms
- **Login**: < 200ms
- **Registration**: < 300ms
- **Profile**: < 100ms
- **Refresh**: < 150ms

### **Throughput**
- **Requests per second**: 1000+
- **Concurrent users**: 1000+
- **Database connections**: 20 max

### **Availability**
- **Uptime**: 99.9%
- **Error rate**: < 0.1%
- **Recovery time**: < 30 seconds

---

## 🧪 **TESTING ENDPOINTS**

### **Test Data**
```bash
# Create test user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPassword123!",
    "confirmPassword": "TestPassword123!"
  }'

# Login with test user
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "test@example.com",
    "password": "TestPassword123!"
  }'
```

### **Load Testing**
```bash
# Test rate limiting
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"emailOrUsername": "test@example.com", "password": "wrong"}'
done
```

---

## 📚 **ADDITIONAL RESOURCES**

- **Swagger Documentation**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health
- **Testing Guide**: [../testing/testing-guide.md](../testing/testing-guide.md)
- **Security Guide**: [../security/security-enhancements.md](../security/security-enhancements.md) 