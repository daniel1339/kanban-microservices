import { registerAs } from '@nestjs/config';

export default () => ({
  // Server Configuration
  port: parseInt(process.env.PORT || '3001', 10),
  host: process.env.HOST || 'localhost',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration (URL only)
  database: {
    url: process.env.DATABASE_URL,
  },
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
  
  // Security Configuration
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  
  // AWS Configuration (for production)
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT, // For LocalStack in development
  },

  // Rate Limiting Configuration
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
    auth: {
      login: {
        ttl: parseInt(process.env.THROTTLE_AUTH_LOGIN_TTL || '300', 10),
        limit: parseInt(process.env.THROTTLE_AUTH_LOGIN_LIMIT || '5', 10),
      },
      register: {
        ttl: parseInt(process.env.THROTTLE_AUTH_REGISTER_TTL || '3600', 10),
        limit: parseInt(process.env.THROTTLE_AUTH_REGISTER_LIMIT || '3', 10),
      },
      refresh: {
        ttl: parseInt(process.env.THROTTLE_AUTH_REFRESH_TTL || '60', 10),
        limit: parseInt(process.env.THROTTLE_AUTH_REFRESH_LIMIT || '10', 10),
      },
    },
  },

  // Security Configuration
  security: {
    password: {
      minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8', 10),
      requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE === 'true',
      requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE === 'true',
      requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS === 'true',
      requireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL_CHARS === 'true',
    },
    session: {
      maxConcurrentSessions: parseInt(process.env.MAX_CONCURRENT_SESSIONS || '5', 10),
      sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600000', 10),
      refreshTokenRotation: process.env.REFRESH_TOKEN_ROTATION === 'true',
    },
    logging: {
      logFailedAttempts: process.env.LOG_FAILED_ATTEMPTS === 'true',
      logSuccessfulLogins: process.env.LOG_SUCCESSFUL_LOGINS === 'true',
      logPasswordChanges: process.env.LOG_PASSWORD_CHANGES === 'true',
      logAccountLockouts: process.env.LOG_ACCOUNT_LOCKOUTS === 'true',
      maskSensitiveData: process.env.MASK_SENSITIVE_DATA === 'true',
    },
    ipControl: {
      whitelist: process.env.IP_WHITELIST?.split(',') || [],
      blacklist: process.env.IP_BLACKLIST?.split(',') || [],
    },
  },

  // Performance Configuration
  performance: {
    cache: {
      ttl: parseInt(process.env.CACHE_TTL || '300', 10),
      maxItems: parseInt(process.env.CACHE_MAX_ITEMS || '100', 10),
      store: process.env.CACHE_STORE || 'memory',
      prefix: process.env.CACHE_PREFIX || 'auth-service',
    },
    database: {
      pool: {
        min: parseInt(process.env.DB_POOL_MIN || '2', 10),
        max: parseInt(process.env.DB_POOL_MAX || '10', 10),
        acquireTimeoutMillis: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '30000', 10),
        createTimeoutMillis: parseInt(process.env.DB_CREATE_TIMEOUT || '30000', 10),
        destroyTimeoutMillis: parseInt(process.env.DB_DESTROY_TIMEOUT || '5000', 10),
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
        reapIntervalMillis: parseInt(process.env.DB_REAP_INTERVAL || '1000', 10),
        createRetryIntervalMillis: parseInt(process.env.DB_CREATE_RETRY_INTERVAL || '200', 10),
      },
      connection: {
        timeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000', 10),
        maxRetries: parseInt(process.env.DB_MAX_RETRIES || '3', 10),
        retryDelay: parseInt(process.env.DB_RETRY_DELAY || '1000', 10),
      },
    },
    compression: {
      enabled: process.env.COMPRESSION_ENABLED === 'true',
      level: parseInt(process.env.COMPRESSION_LEVEL || '6', 10),
      threshold: parseInt(process.env.COMPRESSION_THRESHOLD || '1024', 10),
    },
  },

  // Monitoring Configuration
  monitoring: {
    health: {
      enabled: process.env.HEALTH_CHECK_ENABLED === 'true',
      path: process.env.HEALTH_CHECK_PATH || '/health',
      interval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000', 10),
    },
    metrics: {
      enabled: process.env.METRICS_ENABLED === 'true',
      path: process.env.METRICS_PATH || '/metrics',
      collectDefault: process.env.METRICS_COLLECT_DEFAULT === 'true',
    },
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      format: process.env.LOG_FORMAT || 'json',
      timestamp: process.env.LOG_TIMESTAMP === 'true',
      colorize: process.env.LOG_COLORIZE === 'true',
    },
  },
});
