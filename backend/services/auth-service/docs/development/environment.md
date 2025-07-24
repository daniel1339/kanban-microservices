# Environment Variables - Auth Service

## 📋 Required Variables

### **🔧 Application Configuration**
```bash
NODE_ENV=development          # development, production, test
PORT=3001                     # Service port
API_PREFIX=api/v1            # API prefix
```

### **🗄️ Database**
```bash
# Option 1: Complete URL (recommended)
DATABASE_URL=postgresql://kanban_user:kanban_password@localhost:5432/kanban

# Option 2: Individual variables
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

### **📧 Email (for user verification)**
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

### **🔒 Security**
```bash
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100
```

## 🚀 Environment Configuration

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

## 📁 Next Steps

### **1. Create .env files**
```bash
# Copy and configure
cp .env.example .env.development
cp .env.example .env.production
cp .env.example .env.test
```

### **2. Configure database**
```bash
# Create user and database
CREATE USER kanban_user WITH PASSWORD 'kanban_password';
CREATE DATABASE kanban OWNER kanban_user;
```

### **3. Run migrations**
```bash
npm run migrate:run
```

### **4. Seed database**
```bash
npm run db:seed
```

## 🔧 Configuration Details

### **Database Configuration**
The service supports both PostgreSQL and MySQL databases. The recommended setup is PostgreSQL for better performance and features.

**PostgreSQL Setup:**
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE USER kanban_user WITH PASSWORD 'kanban_password';
CREATE DATABASE kanban OWNER kanban_user;
GRANT ALL PRIVILEGES ON DATABASE kanban TO kanban_user;
```

**MySQL Setup:**
```bash
# Install MySQL
sudo apt-get install mysql-server

# Create database and user
mysql -u root -p
CREATE USER 'kanban_user'@'localhost' IDENTIFIED BY 'kanban_password';
CREATE DATABASE kanban;
GRANT ALL PRIVILEGES ON kanban.* TO 'kanban_user'@'localhost';
FLUSH PRIVILEGES;
```

### **JWT Configuration**
JWT tokens are used for authentication and authorization. The service uses two types of tokens:

- **Access Token**: Short-lived (15 minutes) for API access
- **Refresh Token**: Long-lived (7 days) for token renewal

**Security Recommendations:**
- Use strong, unique secrets for each environment
- Rotate secrets regularly in production
- Store secrets securely (use environment variables or secret management systems)

### **Email Configuration**
Email functionality is used for user verification and password reset. The service supports SMTP providers like Gmail, SendGrid, or AWS SES.

**Gmail Setup:**
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in EMAIL_PASSWORD

**SendGrid Setup:**
```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

### **CORS Configuration**
CORS (Cross-Origin Resource Sharing) is configured to allow requests from specific origins.

**Development:**
```bash
CORS_ORIGIN=http://localhost:3000
```

**Production:**
```bash
CORS_ORIGIN=https://yourdomain.com
```

**Multiple Origins:**
```bash
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

## 🚨 Security Considerations

### **Production Security**
1. **Never commit .env files** to version control
2. **Use strong secrets** for JWT keys
3. **Enable HTTPS** in production
4. **Configure proper CORS** origins
5. **Use environment-specific** configurations
6. **Regularly rotate** secrets and keys

### **Database Security**
1. **Use strong passwords** for database users
2. **Limit database access** to necessary privileges
3. **Enable SSL** for database connections
4. **Regular backups** of production data
5. **Monitor database** access and performance

### **JWT Security**
1. **Use strong secrets** (at least 32 characters)
2. **Set appropriate expiration** times
3. **Implement token refresh** mechanism
4. **Store refresh tokens** securely
5. **Implement token blacklisting** for logout

## 🔍 Troubleshooting

### **Common Issues**

**Database Connection Error:**
```bash
# Check if database is running
sudo systemctl status postgresql

# Check connection
psql -h localhost -U kanban_user -d kanban
```

**JWT Secret Error:**
```bash
# Ensure JWT_SECRET is set
echo $JWT_SECRET

# Check environment file
cat .env.development | grep JWT_SECRET
```

**CORS Error:**
```bash
# Check CORS configuration
echo $CORS_ORIGIN

# Verify frontend origin matches
```

**Email Configuration Error:**
```bash
# Test email configuration
npm run test:email

# Check email credentials
echo $EMAIL_USER
echo $EMAIL_PASSWORD
```

### **Environment Validation**
The service includes environment validation to ensure all required variables are set:

```bash
# Validate environment
npm run validate:env

# Check configuration
npm run config:check
```

## 📚 Additional Resources

- **NestJS Configuration**: https://docs.nestjs.com/techniques/configuration
- **TypeORM Configuration**: https://typeorm.io/#/using-ormconfig
- **JWT Best Practices**: https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/
- **CORS Configuration**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS 