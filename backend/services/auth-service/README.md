# 🔐 Auth Service - Kanban Microservices

Complete authentication service for the Kanban platform, implemented with NestJS, TypeORM and PostgreSQL.

## 🚀 **QUICK START**

### **1. Installation**
```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.development

# Run migrations
npm run migrate:run

# Run seeds
npm run db:seed
```

### **2. Development**
```bash
# Run in development
npm run start:dev

# Run tests
npm run test:all

# View API documentation
# http://localhost:3001/api
```

### **3. Testing**
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# Tests with coverage
npm run test:cov
```

---

## 📚 **DOCUMENTATION AND TESTING STANDARDS**

### **🎯 Mandatory standards for all microservices**

#### **📋 Implementation Checklist**
- [ ] **Complete Swagger/OpenAPI 3.0 Documentation**
- [ ] **Unit Tests** with >90% coverage
- [ ] **E2E Tests** for all endpoints
- [ ] **Professional and complete README.md**
- [ ] **Homogeneous folder structure**
- [ ] **Standardized testing scripts**
- [ ] **Optimized Jest configuration**
- [ ] **Complete API examples**

---

## 📖 **Swagger/OpenAPI Documentation Standards**

- **Version**: OpenAPI 3.0.3
- **Format**: JSON/YAML
- **Tool**: @nestjs/swagger
- **UI**: Swagger UI 5.9.0

### **🏗️ Documentation Structure**
```
src/
├── docs/
│   ├── swagger.config.ts          # Main configuration
│   ├── examples/                  # Request/response examples
│   │   ├── [service].examples.ts
│   │   └── error.examples.ts
│   ├── schemas/                   # Reusable schemas
│   │   ├── [service].schemas.ts
│   │   └── common.schemas.ts
│   └── responses/                 # Typed responses
│       ├── [service].responses.ts
│       └── error.responses.ts
```

- **All endpoints** must have documented request/response examples and errors.
- **Clear and complete descriptions** for each endpoint and DTO.
- **Well-documented status codes** and errors.

---

## 🧪 **Testing Standards**

- **Minimum coverage**: 90% statements, 85% branches, 90% functions, 90% lines
- **Unit tests**: All services and controllers
- **E2E tests**: All critical endpoints
- **Testing scripts**: Standardized in package.json
- **Jest configuration**: Optimized and aligned with monorepo

---

## 📁 **Standardized Folder Structure**

```
service-name/
├── src/
│   ├── docs/
│   │   ├── swagger.config.ts
│   │   ├── examples/
│   │   ├── schemas/
│   │   └── responses/
│   ├── [feature]/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dtos/
│   │   ├── entities/
│   │   └── [feature].module.ts
│   ├── common/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── filters/
│   │   └── decorators/
│   ├── database/
│   │   ├── entities/
│   │   ├── migrations/
│   │   └── seeds/
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── *.e2e-spec.ts
│   ├── jest-e2e.json
│   └── jest-e2e.setup.ts
├── scripts/
├── docs/
├── coverage/
├── README.md
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 📚 **DOCUMENTATION**

### **📁 docs/README.md** - Main documentation
- [📖 View complete documentation](docs/README.md)

### **🔗 API Documentation**
- [📋 Endpoints](docs/api/endpoints.md)
- [📖 Swagger Standards](docs/api/swagger-standards.md)

### **🛠️ Development**
- [⚙️ Environment Setup](docs/development/environment.md)
- [🗄️ Database Migrations](docs/development/migrations.md)
- [⚡ Performance Optimization](docs/development/performance.md)

### **🔒 Security**
- [🛡️ Security Enhancements](docs/security/security-enhancements.md)
- [🚦 Rate Limiting](docs/security/rate-limiting.md)

### **🧪 Testing**
- [📊 Testing Guide](docs/testing/testing-guide.md)
- [📈 Test Coverage](docs/testing/test-coverage.md)

### **🚀 Deployment**
- [📊 Project Status](docs/deployment/status.md)

---

## 🏗️ **ARCHITECTURE**

### **Technologies Used**
- **Framework**: NestJS
- **Database**: PostgreSQL + TypeORM
- **Authentication**: JWT + Refresh Tokens
- **Cache**: Redis/Memory
- **Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest + Supertest

### **Implemented Features**
- ✅ **JWT Authentication** - Login, registration, refresh tokens
- ✅ **Rate Limiting** - Protection against attacks
- ✅ **Security Enhancements** - Helmet, CORS, validation
- ✅ **Performance Optimization** - Cache, compression, monitoring
- ✅ **Database Migrations** - TypeORM with seeds
- ✅ **Testing** - Unit, integration, coverage 90%+
- ✅ **Documentation** - Swagger, READMEs, guides

---

## 🔗 **MAIN ENDPOINTS**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token renewal
- `POST /api/auth/logout` - User logout
- `POST /api/auth/validate` - Credential validation
- `GET /api/auth/profile` - User profile

### **Health & Status**
- `GET /health` - Service health check
- `GET /api` - Swagger documentation

---

## 📊 **PROJECT STATUS**

### **✅ COMPLETED (100%)**
- [x] **Complete authentication functionality**
- [x] **Robust and scalable database**
- [x] **Exhaustive testing** with 90%+ coverage
- [x] **Professional documentation** following OpenAPI 3.0 standards
- [x] **Modular and maintainable architecture**
- [x] **Production ready** with complete configuration

### **🔄 IN PROGRESS**
- [ ] **Dockerization** - Development/production containers
- [ ] **CI/CD Pipeline** - GitHub Actions
- [ ] **Monitoring** - Centralized logs, metrics

### **📋 NEXT STEPS**
1. **User Service** - Extended profile management
2. **Project Service** - Project management
3. **Board Service** - Kanban boards
4. **API Gateway** - Centralized routing

---

## 🧪 **TESTING**

### **Current Coverage: 90%+**
- **Unit Tests**: 100% (38 tests)
- **Integration Tests**: 100% (19 tests)
- **Performance Tests**: Rate limiting and benchmarks

### **Testing Commands**
```bash
# All tests
npm run test:all --forceExit

# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# Tests with coverage
npm run test:cov

# Rate limiting test
npm run test:rate-limit
```

---

## 🔧 **USEFUL COMMANDS**

### **Development**
```bash
npm run start:dev      # Development with hot reload
npm run start:debug    # Development with debug
npm run build          # Production build
npm run start:prod     # Run in production
```

### **Database**
```bash
npm run migrate:run    # Run migrations
npm run migrate:revert # Revert migrations
npm run db:seed        # Run seeds
npm run db:backup      # Create backup
npm run db:status      # Migration status
```

### **Testing**
```bash
npm run test:all       # All tests
npm run test:unit      # Unit tests
npm run test:integration # Integration tests
npm run test:cov       # Tests with coverage
```

---

## 🔗 **USEFUL LINKS**

- **API Documentation**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health
- **Test Coverage**: `npm run test:cov`
- **Complete Documentation**: [docs/README.md](docs/README.md)

---

## ⚡️ **QUICK REQUEST/RESPONSE EXAMPLES**

### **User registration**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user123",
    "password": "Password123!",
    "passwordConfirmation": "Password123!"
  }'
```
**Response:**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "username": "user123",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "expiresIn": 900
}
```

### **Login**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "user@example.com",
    "password": "Password123!"
  }'
```
**Response:**
```json
{
  "user": { ... },
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "expiresIn": 900
}
```

### **Get profile**
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer <jwt-access-token>"
```
**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "username": "user123",
  "isVerified": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 📦 API Error Structure (Unified Format)

All Auth Service endpoints return errors with the following structure to facilitate handling and debugging:

```json
{
  "statusCode": 400,
  "message": "Clear error description",
  "error": "Bad Request",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/route/endpoint"
}
```

- `statusCode`: HTTP error code (400, 401, 404, 409, 422, 429, 500, etc.)
- `message`: Descriptive error message (can be string or array of strings for validations)
- `error`: Error type ("Bad Request", "Unauthorized", etc.)
- `timestamp`: Date and time of error in ISO format
- `path`: Route of the endpoint where the error occurred

This structure is standard and documented in Swagger for all endpoints.

---

## 🔑 **MAIN ENVIRONMENT VARIABLES**

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kanban_auth

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=10

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Others
CORS_ORIGIN=http://localhost:3000
```

---

## 🆘 **SUPPORT AND TROUBLESHOOTING**

### **Steps for common problems**
1. **Verify environment variables:**
   - Make sure `.env.development` or `.env.production` are correctly configured.
   - Use the example above as reference.
2. **Database:**
   - Run `npm run migrate:run` to apply migrations.
   - Run `npm run db:seed` to populate initial data.
   - Verify that the database is running and accessible.
3. **Testing:**
   - Run `npm run test:all` to run all tests.
   - Run `npm run test:cov` to see coverage.
   - If any test fails, check logs and make sure dependencies are installed.
4. **Swagger/OpenAPI:**
   - Access documentation at [http://localhost:3001/api](http://localhost:3001/api).
   - If it doesn't load, verify that the service is running and the port is correct.
5. **Logs:**
   - Check console logs for detailed error messages.
   - Use `npm run start:debug` for more information.
6. **Authentication problems:**
   - Verify that the JWT token is valid and hasn't expired.
   - If you have problems with refresh tokens, make sure the `/auth/refresh` endpoint is working.

### **Still having problems?**
- Check the [complete documentation](docs/README.md) and files in `/docs/`.
- Open an issue or contact the development team.
- Run `npm run test:all` before requesting support to ensure everything is working.

---

## 📄 **LICENSE**

This project is part of the Kanban Microservices system.

---

## 🆘 Troubleshooting and Common Errors

Below is a table of common errors and their quick solutions for the Auth Service:

| Error / Message                                         | Probable Cause                                 | Quick Solution                                      |
|--------------------------------------------------------|------------------------------------------------|------------------------------------------------------|
| `DATABASE_URL is required`                             | Missing database environment variable         | Verify your `.env` file and that the URL is valid   |
| `JWT secret not configured`                            | Missing `JWT_SECRET` variable                 | Add `JWT_SECRET` in your `.env`                     |
| `Invalid credentials` (401)                            | Incorrect username/password or user doesn't exist | Verify sent data and that user exists               |
| `Email already registered` (409)                       | Duplicate email in registration                | Use a different email or clean the database         |
| `Access token required` (401)                          | Missing Authorization header                   | Make sure to send JWT in the header                 |
| `Invalid refresh token` (401)                          | Expired or tampered token                      | Request new login and refresh token                 |
| `ThrottlerException: Too Many Requests` (429)          | Too many requests in short time                | Wait a few seconds and try again                    |
| `User not found` (404)                                 | User doesn't exist or was deleted              | Verify ID or create user                            |
| `Error: connect ECONNREFUSED`                          | Database not available                         | Verify that PostgreSQL is running                   |
| `Error: Simulated error` in tests                      | Simulated internal error test                  | Expected, ignore if other tests pass                |
| `A worker process has failed to exit gracefully...`    | Handle leak in tests (Node/Jest)               | Use `--forceExit` in test scripts                   |

### Additional tips
- **Environment variables:** Use `.env.example` as reference and never commit your secrets to git.
- **Migrations:** If you change entities, run `npm run migrate:run` and check logs.
- **Seeds:** Use `npm run db:seed` to populate test data.
- **Testing:** If tests hang, check open connections and use `--forceExit`.
- **Swagger:** Always access documentation at `/api/docs` to test endpoints and see examples.
- **Logs:** Use `npm run start:debug` to see detailed logs in development.
- **CORS issues:** Verify `CORS_ORIGIN` variable and CORS configuration in backend.

Have an error not documented here? Update this table or consult the team!
