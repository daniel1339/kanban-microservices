# 🔐 Auth Service - Kanban Microservices

Servicio de autenticación completo para la plataforma Kanban, implementado con NestJS, TypeORM y PostgreSQL.

## 🚀 **INICIO RÁPIDO**

### **1. Instalación**
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.development

# Ejecutar migraciones
npm run migrate:run

# Ejecutar seeds
npm run db:seed
```

### **2. Desarrollo**
```bash
# Ejecutar en desarrollo
npm run start:dev

# Ejecutar tests
npm run test:all

# Ver documentación API
# http://localhost:3001/api
```

### **3. Testing**
```bash
# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration

# Tests con coverage
npm run test:cov
```

---

## 📚 **DOCUMENTACIÓN**

### **📁 docs/README.md** - Documentación principal
- [📖 Ver documentación completa](docs/README.md)

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

## 🏗️ **ARQUITECTURA**

### **Tecnologías Utilizadas**
- **Framework**: NestJS
- **Base de Datos**: PostgreSQL + TypeORM
- **Autenticación**: JWT + Refresh Tokens
- **Cache**: Redis/Memory
- **Documentación**: Swagger/OpenAPI 3.0
- **Testing**: Jest + Supertest

### **Características Implementadas**
- ✅ **JWT Authentication** - Login, registro, refresh tokens
- ✅ **Rate Limiting** - Protección contra ataques
- ✅ **Security Enhancements** - Helmet, CORS, validación
- ✅ **Performance Optimization** - Cache, compresión, monitoreo
- ✅ **Database Migrations** - TypeORM con seeds
- ✅ **Testing** - Unit, integration, coverage 90%+
- ✅ **Documentation** - Swagger, READMEs, guías

---

## 🔗 **ENDPOINTS PRINCIPALES**

### **Autenticación**
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Login de usuarios
- `POST /auth/refresh` - Renovación de tokens
- `POST /auth/logout` - Logout de usuarios
- `POST /auth/validate` - Validación de credenciales
- `GET /auth/profile` - Perfil de usuario

### **Health & Status**
- `GET /health` - Health check del servicio
- `GET /api` - Documentación Swagger

---

## 📊 **ESTADO DEL PROYECTO**

### **✅ COMPLETADO (100%)**
- [x] **Funcionalidad completa** de autenticación
- [x] **Base de datos** robusta y escalable
- [x] **Testing exhaustivo** con coverage del 90%+
- [x] **Documentación profesional** siguiendo estándares OpenAPI 3.0
- [x] **Arquitectura modular** y mantenible
- [x] **Listo para producción** con configuración completa

### **🔄 EN PROGRESO**
- [ ] **Dockerización** - Containers para desarrollo/producción
- [ ] **CI/CD Pipeline** - GitHub Actions
- [ ] **Monitoring** - Logs centralizados, métricas

### **📋 PRÓXIMOS PASOS**
1. **User Service** - Gestión de perfiles extendidos
2. **Project Service** - Gestión de proyectos
3. **Board Service** - Tableros Kanban
4. **API Gateway** - Enrutamiento centralizado

---

## 🧪 **TESTING**

### **Cobertura Actual: 90%+**
- **Unit Tests**: 100% (38 tests)
- **Integration Tests**: 100% (19 tests)
- **Performance Tests**: Rate limiting y benchmarks

### **Comandos de Testing**
```bash
# Todos los tests
npm run test:all

# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration

# Tests con coverage
npm run test:cov

# Test de rate limiting
npm run test:rate-limit
```

---

## 🔧 **COMANDOS ÚTILES**

### **Desarrollo**
```bash
npm run start:dev      # Desarrollo con hot reload
npm run start:debug    # Desarrollo con debug
npm run build          # Build para producción
npm run start:prod     # Ejecutar en producción
```

### **Base de Datos**
```bash
npm run migrate:run    # Ejecutar migraciones
npm run migrate:revert # Revertir migraciones
npm run db:seed        # Ejecutar seeds
npm run db:backup      # Crear backup
npm run db:status      # Estado de migraciones
```

### **Testing**
```bash
npm run test:all       # Todos los tests
npm run test:unit      # Tests unitarios
npm run test:integration # Tests de integración
npm run test:cov       # Tests con coverage
```

---

## 🔗 **ENLACES ÚTILES**

- **API Documentation**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health
- **Test Coverage**: `npm run test:cov`
- **Documentación Completa**: [docs/README.md](docs/README.md)

---

## 📞 **SOPORTE**

Para preguntas o problemas:
1. Revisar la [documentación completa](docs/README.md)
2. Ejecutar `npm run test:all` para verificar funcionamiento
3. Revisar logs en `logs/` directory
4. Verificar [guía de troubleshooting](docs/testing/testing-guide.md)

---

## 📄 **LICENCIA**

Este proyecto es parte del sistema Kanban Microservices.
