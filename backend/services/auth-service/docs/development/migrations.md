# Database Migrations & Management

## 🗄️ **GESTIÓN DE BASE DE DATOS Y MIGRATIONS**

### **1. Configuración de TypeORM**

#### **Archivo de Configuración:**
- **ormconfig.ts**: Configuración principal para TypeORM CLI
- **Entidades**: User, RefreshToken
- **Migrations**: `src/database/migrations/*.ts`
- **Synchronize**: Deshabilitado para producción

#### **Variables de Entorno:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=auth_service
NODE_ENV=development
```

### **2. Migrations Implementadas**

#### **1704067200000-CreateInitialTables**
**Descripción**: Creación inicial de tablas y estructura base

**Tablas Creadas:**
- **users**: Tabla principal de usuarios
- **refresh_tokens**: Tabla de tokens de refresco

**Campos de Users:**
- `id`: UUID (Primary Key)
- `email`: VARCHAR(255) UNIQUE
- `username`: VARCHAR(100) UNIQUE
- `password_hash`: VARCHAR(255)
- `is_verified`: BOOLEAN DEFAULT false
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

**Campos de RefreshTokens:**
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key)
- `token`: TEXT
- `expires_at`: TIMESTAMP
- `is_revoked`: BOOLEAN DEFAULT false
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

**Índices Creados:**
- `IDX_USERS_EMAIL`: Optimiza búsquedas por email
- `IDX_USERS_USERNAME`: Optimiza búsquedas por username
- `IDX_USERS_CREATED_AT`: Optimiza ordenamiento por fecha
- `IDX_REFRESH_TOKENS_USER_ID`: Optimiza joins con users
- `IDX_REFRESH_TOKENS_TOKEN`: Optimiza búsquedas por token
- `IDX_REFRESH_TOKENS_EXPIRES_AT`: Optimiza limpieza de tokens expirados
- `IDX_REFRESH_TOKENS_IS_REVOKED`: Optimiza filtros de tokens revocados

**Constraints:**
- Foreign Key: `refresh_tokens.user_id` → `users.id` (CASCADE)

#### **1704153600000-AddUserFields**
**Descripción**: Agregar campos adicionales a la tabla users

**Campos Agregados:**
- `first_name`: VARCHAR(100)
- `last_name`: VARCHAR(100)
- `phone`: VARCHAR(20)
- `avatar_url`: TEXT
- `last_login_at`: TIMESTAMP
- `login_attempts`: INTEGER DEFAULT 0
- `locked_until`: TIMESTAMP
- `email_verified_at`: TIMESTAMP
- `password_changed_at`: TIMESTAMP

**Índices Agregados:**
- `IDX_USERS_LAST_LOGIN_AT`: Optimiza queries de actividad
- `IDX_USERS_LOGIN_ATTEMPTS`: Optimiza detección de ataques
- `IDX_USERS_LOCKED_UNTIL`: Optimiza verificación de bloqueos
- `IDX_USERS_EMAIL_VERIFIED_AT`: Optimiza filtros de verificación

**Constraints Agregados:**
- `CHK_LOGIN_ATTEMPTS`: login_attempts >= 0
- `CHK_PHONE_FORMAT`: Formato de teléfono válido

### **3. Comandos de Migración**

#### **Ejecutar Migrations:**
```bash
# Ejecutar todas las migrations pendientes
npm run migrate

# Ejecutar migrations (alias)
npm run migrate:run
```

#### **Revertir Migrations:**
```bash
# Revertir la última migration
npm run migrate:revert
```

#### **Generar Nueva Migration:**
```bash
# Generar migration basada en cambios de entidades
npm run migrate:generate src/database/migrations/NombreMigration

# Crear migration vacía
npm run migrate:create src/database/migrations/NombreMigration
```

#### **Ver Estado de Migrations:**
```bash
# Ver migrations ejecutadas y pendientes
npm run migrate:show

# Ver estado (alias)
npm run db:status
```

### **4. Seeders (Datos de Prueba)**

#### **UserSeeder:**
**Descripción**: Crea usuarios de prueba para desarrollo

**Usuarios Creados:**
- **admin@example.com**: Usuario administrador
- **user@example.com**: Usuario regular
- **test@example.com**: Usuario de prueba (no verificado)
- **developer@example.com**: Usuario desarrollador
- **manager@example.com**: Usuario manager

**Contraseña**: `password123` (hasheada con bcrypt)

#### **Ejecutar Seeders:**
```bash
# Ejecutar todos los seeders
npm run db:seed

# Reset completo (revert + migrate + seed)
npm run db:reset
```

### **5. Backup y Restore**

#### **Crear Backup:**
```bash
# Crear backup de la base de datos
npm run db:backup
```

#### **Restaurar Backup:**
```bash
# Restaurar desde un archivo de backup
npm run db:restore backup-auth_service-2024-01-01T12-00-00-000Z.sql
```

#### **Listar Backups:**
```bash
# Ver backups disponibles
npm run db:list
```

#### **Configuración de Backup:**
```env
BACKUP_DIR=./backups
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=auth_service
```

### **6. Estructura de Directorios**

```
src/
├── database/
│   ├── migrations/
│   │   ├── 1704067200000-CreateInitialTables.ts
│   │   └── 1704153600000-AddUserFields.ts
│   └── seeds/
│       ├── user.seeder.ts
│       └── run-seeds.ts
├── auth/
│   └── entities/
│       ├── user.entity.ts
│       └── refresh-token.entity.ts
└── scripts/
    └── backup-db.ts
```

### **7. Optimización de Base de Datos**

#### **Índices Implementados:**
- **Búsquedas por email/username**: Índices únicos
- **Ordenamiento por fecha**: Índices en timestamps
- **Joins eficientes**: Índices en foreign keys
- **Filtros comunes**: Índices en campos booleanos

#### **Constraints de Integridad:**
- **Foreign Keys**: CASCADE para mantener integridad
- **Unique Constraints**: Email y username únicos
- **Check Constraints**: Validación de datos
- **Not Null**: Campos obligatorios

#### **Performance:**
- **Connection Pool**: Configurado para producción
- **Query Optimization**: Índices estratégicos
- **Slow Query Logging**: Monitoreo de performance

### **8. Workflow de Desarrollo**

#### **Nuevo Feature:**
1. **Crear migration**: `npm run migrate:create src/database/migrations/NombreFeature`
2. **Implementar cambios**: Modificar entidades y migration
3. **Ejecutar migration**: `npm run migrate`
4. **Crear seeder** (si es necesario): Agregar datos de prueba
5. **Testear**: Verificar que todo funciona

#### **Deploy a Producción:**
1. **Backup**: `npm run db:backup`
2. **Ejecutar migrations**: `npm run migrate`
3. **Verificar**: `npm run db:status`
4. **Rollback** (si es necesario): `npm run migrate:revert`

### **9. Troubleshooting**

#### **Problemas Comunes:**

##### **Migration Fails:**
```bash
# Verificar estado
npm run db:status

# Revertir última migration
npm run migrate:revert

# Verificar logs de error
tail -f logs/migration.log
```

##### **Connection Issues:**
```bash
# Verificar variables de entorno
echo $DB_HOST $DB_PORT $DB_NAME

# Testear conexión
psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME
```

##### **Backup Fails:**
```bash
# Verificar pg_dump instalado
which pg_dump

# Verificar permisos
ls -la backups/

# Verificar espacio en disco
df -h
```

### **10. Monitoreo y Mantenimiento**

#### **Tareas Programadas:**
```bash
# Backup diario (cron)
0 2 * * * cd /path/to/auth-service && npm run db:backup

# Limpieza de backups antiguos (cron)
0 3 * * * find ./backups -name "*.sql" -mtime +30 -delete

# Limpieza de tokens expirados (cron)
0 4 * * * cd /path/to/auth-service && npm run cleanup:tokens
```

#### **Métricas a Monitorear:**
- **Tamaño de base de datos**: Crecimiento mensual
- **Performance de queries**: Tiempo de respuesta
- **Uso de índices**: Eficiencia de consultas
- **Conexiones activas**: Pool de conexiones
- **Espacio en disco**: Backups y logs

### **11. Seguridad**

#### **Buenas Prácticas:**
- **Backups encriptados**: Usar GPG para encriptar backups
- **Permisos mínimos**: Usuario de DB con permisos limitados
- **Logs de auditoría**: Registrar cambios importantes
- **Validación de datos**: Constraints en nivel de DB
- **Backup offsite**: Copias en ubicación remota

#### **Variables Sensibles:**
```env
# Nunca committear al repositorio
DB_PASSWORD=your-secure-password
JWT_SECRET=your-super-secret-key
```

### **12. Comandos de Utilidad**

#### **Verificar Integridad:**
```bash
# Verificar foreign keys
psql -d auth_service -c "SELECT * FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY';"

# Verificar índices
psql -d auth_service -c "SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public';"

# Verificar constraints
psql -d auth_service -c "SELECT conname, contype FROM pg_constraint WHERE conrelid = 'users'::regclass;"
```

#### **Análisis de Performance:**
```bash
# Ver queries lentos
psql -d auth_service -c "SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Ver uso de índices
psql -d auth_service -c "SELECT schemaname, tablename, indexname, idx_scan FROM pg_stat_user_indexes ORDER BY idx_scan DESC;"
``` 