# Variables de Entorno - Auth Service

## 📋 Variables Requeridas

### **🔧 Configuración de Aplicación**
```bash
NODE_ENV=development          # development, production, test
PORT=3001                     # Puerto del servicio
API_PREFIX=api/v1            # Prefijo de la API
```

### **🗄️ Base de Datos**
```bash
# Opción 1: URL completa (recomendado)
DATABASE_URL=postgresql://kanban_user:kanban_password@localhost:5432/kanban

# Opción 2: Variables individuales
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=kanban_user
DB_PASSWORD=kanban_password
DB_NAME=kanban
```

### **🔐 JWT (JSON Web Tokens)**
```bash
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### **📧 Email (para verificación de usuarios)**
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@kanban.com
```

### **🌐 CORS**
```bash
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true
```

### **🔒 Seguridad**
```bash
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100
```

## 🚀 Configuración por Entorno

### **Development (.env.development)**
```bash
NODE_ENV=development
DATABASE_URL=postgresql://kanban_user:kanban_password@localhost:5432/kanban
JWT_SECRET=dev-secret-key
JWT_REFRESH_SECRET=dev-refresh-secret
CORS_ORIGIN=http://localhost:3000
```

### **Production (.env.production)**
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/kanban
JWT_SECRET=super-secure-production-key
JWT_REFRESH_SECRET=super-secure-refresh-key
CORS_ORIGIN=https://yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### **Testing (.env.test)**
```bash
NODE_ENV=test
DATABASE_URL=postgresql://kanban_user:kanban_password@localhost:5432/kanban_test
JWT_SECRET=test-secret-key
JWT_REFRESH_SECRET=test-refresh-secret
```

## 📁 Próximos Pasos

### **1. Crear archivos .env**
```bash
# Copiar y configurar
cp .env.example .env.development
cp .env.example .env.production
cp .env.example .env.test
```

### **2. Configurar base de datos**
```bash
# Crear usuario y base de datos
CREATE USER kanban_user WITH PASSWORD 'kanban_password';
CREATE DATABASE kanban OWNER kanban_user;
CREATE DATABASE kanban_test OWNER kanban_user;
```

### **3. Ejecutar migraciones**
```bash
npm run migrate:run
```

### **4. Verificar configuración**
```bash
npm run test:all
```

## 🔄 Siguientes Servicios a Implementar

### **1. User Service** (Próximo)
- Gestión de perfiles de usuario
- Subida de avatares
- Preferencias de usuario
- Historial de actividad

### **2. Project Service**
- Creación y gestión de proyectos
- Roles y permisos
- Configuración de proyectos

### **3. Board Service**
- Tableros Kanban
- Columnas y tarjetas
- Drag & drop

### **4. Notification Service**
- Notificaciones en tiempo real
- Email notifications
- Push notifications

### **5. File Service**
- Subida de archivos
- Gestión de imágenes
- Almacenamiento en AWS S3

## 🏗️ Arquitectura Completa

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Load Balancer │
│   (React/Vue)   │◄──►│   (Kong/Nginx)  │◄──►│   (Nginx)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Service  │    │   User Service  │    │ Project Service │
│   (Port 3001)   │    │   (Port 3002)   │    │   (Port 3003)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Board Service  │    │ Notification    │    │   File Service  │
│   (Port 3004)   │    │   (Port 3005)   │    │   (Port 3006)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │     Redis       │    │   AWS S3        │
│   (Database)    │    │   (Cache/Queue) │    │   (Files)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Estado Actual vs Próximos Pasos

### **✅ COMPLETADO (Auth Service)**
- [x] Autenticación JWT
- [x] Registro y login
- [x] Refresh tokens
- [x] Validación de usuarios
- [x] Tests unitarios y e2e
- [x] Documentación Swagger
- [x] Configuración de base de datos

### **🔄 EN PROGRESO**
- [ ] Configuración de variables de entorno
- [ ] Dockerización
- [ ] CI/CD pipeline

### **📋 PRÓXIMOS PASOS**
1. **Configurar variables de entorno**
2. **Dockerizar el servicio**
3. **Implementar User Service**
4. **Configurar comunicación entre servicios**
5. **Implementar API Gateway**
6. **Configurar monitoreo y logging**

¿Quieres que procedamos con la configuración de variables de entorno o prefieres continuar con otro servicio? 