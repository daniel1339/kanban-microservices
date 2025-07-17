# Variables de Entorno para Producción

## 🔧 Render (Backend) - Variables de Entorno

### **Variables Comunes para todos los microservicios:**

| Variable | Valor | Descripción | Requerida |
|----------|-------|-------------|-----------|
| `NODE_ENV` | `production` | Entorno de producción | ✅ |
| `DATABASE_URL` | `[AUTO]` | URL de PostgreSQL (se configura automáticamente) | ✅ |
| `JWT_SECRET` | `[GENERAR]` | Clave secreta para JWT (mínimo 32 caracteres) | ✅ |
| `JWT_EXPIRES_IN` | `24h` | Tiempo de expiración del JWT | ✅ |
| `JWT_REFRESH_SECRET` | `[GENERAR]` | Clave secreta para refresh JWT | ✅ |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Tiempo de expiración del refresh JWT | ✅ |
| `BCRYPT_ROUNDS` | `12` | Rondas de encriptación para bcrypt | ✅ |
| `CORS_ORIGIN` | `[FRONTEND_URL]` | URL del frontend en Vercel | ✅ |

### **Variables Específicas por Microservicio:**

#### **Auth Service:**
| Variable | Valor | Descripción |
|----------|-------|-------------|
| `PORT` | `3001` | Puerto del servicio |
| `REDIS_URL` | `[UPSTASH_URL]` | URL de Redis (Upstash) |
| `SENDGRID_API_KEY` | `[SENDGRID_KEY]` | API Key de SendGrid |
| `SENDGRID_FROM_EMAIL` | `noreply@tudominio.com` | Email de envío |

#### **User Service:**
| Variable | Valor | Descripción |
|----------|-------|-------------|
| `PORT` | `3002` | Puerto del servicio |

#### **Board Service:**
| Variable | Valor | Descripción |
|----------|-------|-------------|
| `PORT` | `3003` | Puerto del servicio |

#### **List Service:**
| Variable | Valor | Descripción |
|----------|-------|-------------|
| `PORT` | `3004` | Puerto del servicio |

#### **Card Service:**
| Variable | Valor | Descripción |
|----------|-------|-------------|
| `PORT` | `3005` | Puerto del servicio |

#### **Notification Service:**
| Variable | Valor | Descripción |
|----------|-------|-------------|
| `PORT` | `3006` | Puerto del servicio |
| `REDIS_URL` | `[UPSTASH_URL]` | URL de Redis (Upstash) |
| `SENDGRID_API_KEY` | `[SENDGRID_KEY]` | API Key de SendGrid |

#### **File Service:**
| Variable | Valor | Descripción |
|----------|-------|-------------|
| `PORT` | `3007` | Puerto del servicio |
| `CLOUDINARY_CLOUD_NAME` | `[CLOUDINARY_NAME]` | Cloud name de Cloudinary |
| `CLOUDINARY_API_KEY` | `[CLOUDINARY_KEY]` | API Key de Cloudinary |
| `CLOUDINARY_API_SECRET` | `[CLOUDINARY_SECRET]` | API Secret de Cloudinary |

#### **API Gateway:**
| Variable | Valor | Descripción |
|----------|-------|-------------|
| `PORT` | `3000` | Puerto del servicio |

## 🌐 Vercel (Frontend) - Variables de Entorno

| Variable | Valor | Descripción | Requerida |
|----------|-------|-------------|-----------|
| `NEXT_PUBLIC_API_URL` | `https://kanban-api-gateway.onrender.com` | URL del API Gateway | ✅ |
| `NEXT_PUBLIC_AUTH_URL` | `https://kanban-auth-service.onrender.com` | URL del Auth Service | ✅ |

## 🔑 Cómo Generar las Claves Secretas

### **JWT_SECRET y JWT_REFRESH_SECRET:**
```bash
# En PowerShell
$jwtSecret = -join ((33..126) | Get-Random -Count 64 | ForEach-Object {[char]$_})
echo $jwtSecret
```

### **O usar un generador online:**
- https://generate-secret.vercel.app/64
- https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx

## 📝 Pasos para Configurar en Render

1. **Ir a Render Dashboard**
2. **Seleccionar cada servicio**
3. **Ir a "Environment"**
4. **Agregar cada variable de la tabla**

## 📝 Pasos para Configurar en Vercel

1. **Ir a Vercel Dashboard**
2. **Seleccionar el proyecto**
3. **Ir a "Settings" > "Environment Variables"**
4. **Agregar cada variable de la tabla**

## ⚠️ Variables Sensibles (NO subir a GitHub)

- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `SENDGRID_API_KEY`
- `CLOUDINARY_API_SECRET`
- `DATABASE_URL` (se configura automáticamente en Render)

## 🔗 URLs de Servicios en Render

Una vez desplegados, las URLs serán:
- API Gateway: `https://kanban-api-gateway.onrender.com`
- Auth Service: `https://kanban-auth-service.onrender.com`
- User Service: `https://kanban-user-service.onrender.com`
- Board Service: `https://kanban-board-service.onrender.com`
- List Service: `https://kanban-list-service.onrender.com`
- Card Service: `https://kanban-card-service.onrender.com`
- Notification Service: `https://kanban-notification-service.onrender.com`
- File Service: `https://kanban-file-service.onrender.com` 