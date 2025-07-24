# 🌐 Language Policy: English Only

**All code, documentation, comments, error responses, and examples in this microservice must be written in English.**

- This is a mandatory standard for the API Gateway and all microservices in this monorepo.
- All new features, bug fixes, and documentation updates must be in English.
- All error structures, Swagger/OpenAPI documentation, and README files must use English.
- This ensures consistency, professionalism, and global collaboration.

---

# 🚀 API Gateway - Kanban Microservices

## 🛑 Circuit Breaker (Resilience Pattern)

The API Gateway uses a circuit breaker for all proxied microservice requests:

- **Failure tracking**: If a service instance fails 3 times in a row, the circuit opens for that instance.
- **Open circuit**: While open, no requests are sent to that instance for 30 seconds.
- **Automatic recovery**: After 30 seconds, the circuit closes and requests are retried.
- **Success resets**: A successful request immediately closes the circuit for that instance.

**Example error response when all instances are open (circuit open):**
```json
{
  "statusCode": 503,
  "message": "All instances for service 'auth' are unavailable (circuit open or unhealthy)",
  "error": "Service Unavailable",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/auth/login",
  "method": "POST"
}
```

**How it works:**
- The gateway tracks failures and opens the circuit for failing instances.
- While open, those instances are skipped by the load balancer.
- After a timeout, the circuit closes and the instance is retried.
- This prevents cascading failures and improves system resilience.

---

## ⚖️ Advanced Load Balancer (Round-Robin + Health Check)

The API Gateway uses an advanced load balancer for all proxied microservice requests:

- **Round-robin**: Requests are distributed evenly across all healthy instances of a service.
- **Health check**: Only healthy instances are selected. If all instances are unhealthy, the gateway returns a 503 error.
- **Automatic failover**: If an instance fails, it is marked as unhealthy and skipped until it recovers.

**Example error response when no healthy instance is available:**
```json
{
  "statusCode": 503,
  "message": "No healthy instance available for service 'auth'",
  "error": "Service Unavailable",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/auth/login",
  "method": "POST"
}
```

**How it works:**
- The gateway maintains a list of instances for each service (simulated in local/dev).
- Each request is routed to the next healthy instance in round-robin order.
- If an instance fails, it is marked as unhealthy and skipped.
- Health status can be updated automatically (future) or manually (for testing).

---

## 📦 Unified Error Structure (Standard)

All error responses from the API Gateway follow this unified format:

```json
{
  "statusCode": 400,
  "message": "Clear error description",
  "error": "Bad Request",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/endpoint/path",
  "method": "POST",
  "requestId": "optional-request-id"
}
```
- `statusCode`: HTTP status code (400, 401, 404, 409, 422, 429, 500, etc.)
- `message`: Descriptive error message (string or array)
- `error`: Error type ("Bad Request", "Unauthorized", etc.)
- `timestamp`: ISO date/time
- `path`: Endpoint path
- `method`: HTTP method
- `requestId`: Optional request ID for tracking

## 🚦 Rate Limiting Example

If you exceed the allowed number of requests, you will receive:

```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded. Please try again later.",
  "error": "Too Many Requests",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/auth/login",
  "method": "POST"
}
```
- Rate limiting is per IP/user and configurable via environment variables.

## 🔐 JWT Authentication Example

All protected endpoints require a JWT Bearer token:

```
Authorization: Bearer <your-jwt-token>
```
- You must include this header in your requests to access protected resources.

## 🧪 Testing & Coverage Guide

- **Run all tests:**
  ```bash
  npm run test:all
  ```
- **Run unit tests only:**
  ```bash
  npm run test:unit
  ```
- **Run integration tests only:**
  ```bash
  npm run test:integration
  ```
- **View coverage report:**
  ```bash
  npm run test:cov
  ```
- **Minimum required coverage:**
  - Statements: 90%
  - Branches: 85%
  - Functions: 90%
  - Lines: 90%
- If coverage drops, add more unit/E2E tests for error cases, edge cases, and middleware.

## 📖 Swagger & Health Endpoints

- **Swagger UI:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
  - Interactive API documentation, try endpoints directly, see request/response examples.
- **Health Check:**
  - `GET /health` — Gateway health
  - `GET /health/services` — Microservices health

## ⚙️ Environment Variables Example

See `.env.example` for all available configuration options:

```env
NODE_ENV=development
PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3002
PROJECT_SERVICE_URL=http://localhost:3003
BOARD_SERVICE_URL=http://localhost:3004
JWT_SECRET=your-jwt-secret
RATE_LIMIT_TTL=60000
RATE_LIMIT_LIMIT=100
CORS_ORIGIN=*
```

---

## 📋 **PROJECT OVERVIEW**

The API Gateway serves as the **single entry point** for all client applications in the Kanban microservices architecture. It handles routing, authentication, rate limiting, and provides a unified interface for all microservices.

### **🏗️ Architecture Role**
```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Vue)                     │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   API GATEWAY (Port 3000)                  │
│  • Routing • Rate Limiting • CORS • Authentication         │
│  • Service Discovery • Load Balancing • Health Checks      │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Auth Service│ │User Service │ │Project Svc  │ │Board Service│
│   Port 3001 │ │  Port 3002  │ │  Port 3003  │ │  Port 3004  │
│ ✅ COMPLETE │ │ ✅ COMPLETE │ │ 📋 PENDING  │ │ 📋 PENDING  │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

---

## 🎯 **CURRENT STATUS**

### **✅ COMPLETED (0%)**
- [x] **Basic NestJS project** - Initial setup
- [x] **Project structure** - Standardized folders
- [x] **Configuration files** - TypeScript and Jest setup

### **🔄 IN PROGRESS (DÍA 6)**
- [ ] **Service Discovery** - Dynamic service routing
- [ ] **Authentication Middleware** - JWT validation
- [ ] **Rate Limiting** - Request throttling
- [ ] **Health Checks** - Service monitoring
- [ ] **Documentation** - Swagger and README
- [ ] **Testing** - 90% coverage target

### **📋 NEXT STEPS**
1. **Core Implementation** - Service discovery and routing
2. **Middleware Stack** - Auth, rate limiting, CORS
3. **Health Monitoring** - Service health checks
4. **Documentation** - Complete API documentation
5. **Testing** - Unit, integration, and E2E tests

---

## 🏗️ **ARCHITECTURE & FEATURES**

### **🔗 Service Routing Map**
```yaml
# Authentication & User Management
/api/auth/* → auth-service:3001
/api/users/* → user-service:3002

# Project & Board Management (Future)
/api/projects/* → project-service:3003
/api/boards/* → board-service:3004
/api/cards/* → card-service:3005
/api/lists/* → list-service:3006

# Infrastructure Services (Future)
/api/notifications/* → notification-service:3007
/api/files/* → file-service:3008
```

### **🛡️ Middleware Stack**
1. **CORS** - Cross-origin resource sharing
2. **Rate Limiting** - Request throttling per IP/user
3. **Authentication** - JWT token validation
4. **Logging** - Request/response logging
5. **Error Handling** - Global error management
6. **Request Transformation** - Data format conversion

### **📊 Health Monitoring**
- **Service Health Checks** - Individual service monitoring
- **Circuit Breaker** - Fault tolerance pattern
- **Load Balancing** - Request distribution
- **Metrics Collection** - Performance monitoring

---

## 🚀 **QUICK START**

### **1. Installation**
```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.development

# Start development server
npm run start:dev
```

### **2. Development**
```bash
# Run in development mode
npm run start:dev

# Run tests
npm run test:all

# View API documentation
# http://localhost:3000/api/docs
```

### **3. Testing**
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# All tests with coverage
npm run test:all
```

---

## 📚 **API DOCUMENTATION**

### **🔗 Main Endpoints**
- **Health Check**: `GET /health`
- **API Documentation**: `GET /api/docs`
- **Service Status**: `GET /api/status`

### **🔐 Authentication**
All protected endpoints require JWT Bearer Token:
```bash
Authorization: Bearer <your-jwt-token>
```

### **📖 Swagger Documentation**
- **URL**: http://localhost:3000/api/docs
- **Interactive API**: Try endpoints directly
- **Authentication**: JWT Bearer Token support
- **Examples**: Request/response examples

---

## 🧪 **TESTING STANDARDS**

### **📊 Coverage Requirements**
- **Statements**: 90%
- **Branches**: 85%
- **Functions**: 90%
- **Lines**: 90%

### **🧪 Test Types**
1. **Unit Tests** - Individual components
2. **Integration Tests** - Service communication
3. **E2E Tests** - Complete routing flows
4. **Performance Tests** - Load testing

### **🔧 Test Commands**
```bash
# Run all tests
npm run test:all

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# Coverage report
npm run test:cov
```

---

## 🔧 **CONFIGURATION**

### **Environment Variables**
```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Service URLs
AUTH_SERVICE_URL=http://localhost:3001
USER_SERVICE_URL=http://localhost:3002
PROJECT_SERVICE_URL=http://localhost:3003
BOARD_SERVICE_URL=http://localhost:3004

# JWT Configuration
JWT_SECRET=your-jwt-secret

# Rate Limiting
RATE_LIMIT_TTL=60000
RATE_LIMIT_LIMIT=100

# CORS Configuration
CORS_ORIGIN=*
```

### **Service Discovery Configuration**
```typescript
// config/services.config.ts
export const servicesConfig = {
  auth: {
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    healthCheck: '/health',
    timeout: 5000,
  },
  user: {
    url: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    healthCheck: '/health',
    timeout: 5000,
  },
  // ... other services
};
```

---

## 📁 **PROJECT STRUCTURE**

```
api-gateway/
├── src/
│   ├── docs/                     # Swagger Documentation
│   │   ├── swagger.config.ts
│   │   ├── examples/
│   │   ├── schemas/
│   │   └── responses/
│   ├── common/                   # Shared code
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── middleware/
│   │   └── services/
│   ├── gateway/                  # Gateway logic
│   │   ├── controllers/
│   │   ├── services/
│   │   └── gateway.module.ts
│   ├── config/                   # Configuration
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/                         # E2E Tests
│   ├── helpers/
│   ├── *.e2e-spec.ts
│   └── jest-e2e.json
├── docs/                         # Additional documentation
├── README.md                     # This file
├── package.json
└── .env.example
```

---

## 🔐 **SECURITY FEATURES**

### **Authentication & Authorization**
- **JWT Token Validation** - Centralized authentication
- **Token Refresh** - Automatic token renewal
- **Role-based Access** - Service-level permissions

### **Rate Limiting**
- **IP-based Limiting** - Prevent abuse
- **User-based Limiting** - Per-user quotas
- **Service-specific Limits** - Different limits per service

### **CORS Configuration**
- **Configurable Origins** - Environment-based
- **Method Restrictions** - HTTP method control
- **Header Management** - Custom headers support

---

## 📊 **MONITORING & HEALTH**

### **Health Check Endpoints**
```bash
# Overall gateway health
GET /health

# Individual service health
GET /health/services

# Detailed service status
GET /health/services/auth
GET /health/services/user
```

### **Metrics Collection**
- **Request Count** - Total requests per service
- **Response Time** - Average response times
- **Error Rates** - Error percentages
- **Service Availability** - Uptime monitoring

---

## 🚀 **DEPLOYMENT**

### **Production Configuration**
```bash
# Build the application
npm run build

# Start production server
npm run start:prod

# Environment variables
NODE_ENV=production
PORT=3000
```

### **Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/src/main"]
```

---

## 🔗 **SERVICE INTEGRATION**

### **Current Services**
- ✅ **Auth Service** (Port 3001) - Authentication and user management
- ✅ **User Service** (Port 3002) - User profiles and avatars

### **Future Services**
- 📋 **Project Service** (Port 3003) - Project management
- 📋 **Board Service** (Port 3004) - Kanban boards
- 📋 **Card Service** (Port 3005) - Card management
- 📋 **List Service** (Port 3006) - List management
- 📋 **Notification Service** (Port 3007) - Notifications
- 📋 **File Service** (Port 3008) - File management

---

## 📈 **PERFORMANCE METRICS**

### **Target Performance**
- **Requests per second**: 1000+
- **Response time**: < 100ms average
- **Uptime**: 99.9%
- **Error rate**: < 0.1%

### **Load Balancing**
- **Round-robin** - Default distribution
- **Health-based** - Skip unhealthy services
- **Circuit breaker** - Fault tolerance

---

## 🛠️ **DEVELOPMENT WORKFLOW**

### **1. Setup Development Environment**
```bash
# Clone repository
git clone <repository-url>
cd api-gateway

# Install dependencies
npm install

# Configure environment
cp .env.example .env.development

# Start development
npm run start:dev
```

### **2. Adding New Services**
1. **Update service configuration** in `config/services.config.ts`
2. **Add routing rules** in `gateway/services/routing.service.ts`
3. **Update health checks** in `gateway/services/health-check.service.ts`
4. **Add tests** for new service integration
5. **Update documentation** with new endpoints

### **3. Testing New Features**
```bash
# Run tests for specific feature
npm run test -- --testNamePattern="feature-name"

# Run integration tests
npm run test:integration

# Check coverage
npm run test:cov
```

---

## 📞 **SUPPORT & TROUBLESHOOTING**

### **Common Issues**
1. **Service Unavailable** - Check service health endpoints
2. **Authentication Errors** - Verify JWT token validity
3. **Rate Limiting** - Check request limits
4. **CORS Errors** - Verify origin configuration

### **Debugging**
```bash
# Enable debug logging
DEBUG=* npm run start:dev

# Check service health
curl http://localhost:3000/health

# Test specific service
curl http://localhost:3000/api/auth/health
```

---

## 📚 **ADDITIONAL RESOURCES**

### **Documentation**
- **[API Documentation](http://localhost:3000/api/docs)** - Interactive Swagger UI
- **[Health Check](http://localhost:3000/health)** - Service status
- **[Project Documentation](../README.md)** - Main project docs

### **Related Services**
- **[Auth Service](../auth-service/README.md)** - Authentication service
- **[User Service](../user-service/README.md)** - User management service

---

## 🎯 **ROADMAP**

### **Phase 1: Core Gateway (Current)**
- [x] Basic project setup
- [ ] Service discovery implementation
- [ ] Routing and proxy functionality
- [ ] Authentication middleware
- [ ] Rate limiting
- [ ] Health checks
- [ ] Documentation and testing

### **Phase 2: Advanced Features (Future)**
- [ ] Load balancing algorithms
- [ ] Circuit breaker patterns
- [ ] Metrics and monitoring
- [ ] Performance optimization
- [ ] AWS integration

### **Phase 3: Production Ready (Future)**
- [ ] High availability setup
- [ ] Auto-scaling configuration
- [ ] Advanced monitoring
- [ ] Security hardening

---

## 📄 **LICENSE**

This project is part of the Kanban Microservices system.

---

**Ready to build the central nervous system of our microservices architecture! 🚀**
