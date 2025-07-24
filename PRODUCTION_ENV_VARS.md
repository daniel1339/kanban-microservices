# Production Environment Variables

## 🔧 Render (Backend) - Environment Variables

### **Common Variables for All Microservices:**

| Variable | Value | Description | Required |
|----------|-------|-------------|----------|
| `NODE_ENV` | `production` | Production environment | ✅ |
| `DATABASE_URL` | `[AUTO]` | PostgreSQL URL (configured automatically) | ✅ |
| `JWT_SECRET` | `[GENERATE]` | Secret key for JWT (minimum 32 characters) | ✅ |
| `JWT_EXPIRES_IN` | `24h` | JWT expiration time | ✅ |
| `JWT_REFRESH_SECRET` | `[GENERATE]` | Secret key for refresh JWT | ✅ |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh JWT expiration time | ✅ |
| `BCRYPT_ROUNDS` | `12` | Bcrypt encryption rounds | ✅ |
| `CORS_ORIGIN` | `[FRONTEND_URL]` | Frontend URL on Vercel | ✅ |

### **Service-Specific Variables:**

#### **Auth Service:**
| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `3001` | Service port |
| `REDIS_URL` | `[UPSTASH_URL]` | Redis URL (Upstash) |
| `SENDGRID_API_KEY` | `[SENDGRID_KEY]` | SendGrid API Key |
| `SENDGRID_FROM_EMAIL` | `noreply@yourdomain.com` | Sender email |

#### **User Service:**
| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `3002` | Service port |

#### **Board Service:**
| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `3003` | Service port |

#### **List Service:**
| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `3004` | Service port |

#### **Card Service:**
| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `3005` | Service port |

#### **Notification Service:**
| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `3006` | Service port |
| `REDIS_URL` | `[UPSTASH_URL]` | Redis URL (Upstash) |
| `SENDGRID_API_KEY` | `[SENDGRID_KEY]` | SendGrid API Key |

#### **File Service:**
| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `3007` | Service port |
| `CLOUDINARY_CLOUD_NAME` | `[CLOUDINARY_NAME]` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `[CLOUDINARY_KEY]` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | `[CLOUDINARY_SECRET]` | Cloudinary API Secret |

#### **API Gateway:**
| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `3000` | Service port |

## 🌐 Vercel (Frontend) - Environment Variables

| Variable | Value | Description | Required |
|----------|-------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | `https://kanban-api-gateway.onrender.com` | API Gateway URL | ✅ |
| `NEXT_PUBLIC_AUTH_URL` | `https://kanban-auth-service.onrender.com` | Auth Service URL | ✅ |

## 🔑 How to Generate Secret Keys

### **JWT_SECRET and JWT_REFRESH_SECRET:**
```bash
# In PowerShell
$jwtSecret = -join ((33..126) | Get-Random -Count 64 | ForEach-Object {[char]$_})
echo $jwtSecret
```

### **Or use an online generator:**
- https://generate-secret.vercel.app/64
- https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx

## 📝 Steps to Configure in Render

1. **Go to Render Dashboard**
2. **Select each service**
3. **Go to "Environment"**
4. **Add each variable from the table**

## 📝 Steps to Configure in Vercel

1. **Go to Vercel Dashboard**
2. **Select the project**
3. **Go to "Settings" > "Environment Variables"**
4. **Add each variable from the table**

## ⚠️ Sensitive Variables (DO NOT upload to GitHub)

- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `SENDGRID_API_KEY`
- `CLOUDINARY_API_SECRET`
- `DATABASE_URL` (configured automatically in Render)

## 🔗 Service URLs on Render

Once deployed, the URLs will be:
- API Gateway: `https://kanban-api-gateway.onrender.com`
- Auth Service: `https://kanban-auth-service.onrender.com`
- User Service: `https://kanban-user-service.onrender.com`
- Board Service: `https://kanban-board-service.onrender.com`
- List Service: `https://kanban-list-service.onrender.com`
- Card Service: `https://kanban-card-service.onrender.com`
- Notification Service: `https://kanban-notification-service.onrender.com`
- File Service: `https://kanban-file-service.onrender.com` 