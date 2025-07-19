# Migraciones - Auth Service

Este documento explica cómo trabajar con las migraciones de base de datos en el Auth Service.

## 📋 Comandos Disponibles

### Ejecutar Migraciones
```bash
npm run migrate:run
```
Ejecuta todas las migraciones pendientes.

### Revertir Última Migración
```bash
npm run migrate:revert
```
Revierte la última migración ejecutada.

### Generar Nueva Migración
```bash
npm run migrate:generate <nombre-migracion>
```
Genera una nueva migración basada en los cambios detectados en las entidades.

## 🗂️ Migraciones Existentes

### 1. CreateUsersTable (1700000000000)
- Crea la tabla `users` con todos los campos necesarios
- Incluye índices para email, username y estado activo
- Configura la extensión `uuid-ossp` para UUIDs

### 2. CreateRefreshTokensTable (1700000000001)
- Crea la tabla `refresh_tokens` con relación a users
- Incluye campos para tracking de sesiones
- Configura foreign key con CASCADE

## 🔧 Configuración

Las migraciones utilizan la configuración de base de datos definida en:
- `src/config/database.config.ts`
- Variables de entorno en `.env`

## ⚠️ Notas Importantes

1. **Siempre haz backup** antes de ejecutar migraciones en producción
2. **Revisa las migraciones** antes de ejecutarlas
3. **Prueba en desarrollo** antes de aplicar en producción
4. **Las migraciones son irreversibles** en producción (excepto con revert)

## 🚀 Flujo de Trabajo

1. **Desarrollo**: Modifica las entidades
2. **Generar**: `npm run migrate:generate <nombre>`
3. **Revisar**: Verifica la migración generada
4. **Probar**: Ejecuta en entorno de desarrollo
5. **Aplicar**: Ejecuta en producción

## 🔍 Verificar Estado

Para verificar el estado de las migraciones, puedes consultar la tabla `migrations` en la base de datos:

```sql
SELECT * FROM migrations ORDER BY timestamp DESC;
``` 