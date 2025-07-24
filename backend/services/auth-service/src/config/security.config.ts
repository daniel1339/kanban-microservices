import { registerAs } from '@nestjs/config';

export default registerAs('security', () => ({
  // Helmet Configuration
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'X-API-Key',
      'X-Client-Version',
    ],
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
      'X-Total-Count',
    ],
    maxAge: 86400, // 24 hours
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },

  // Slow Down Configuration
  slowDown: {
    windowMs: parseInt(process.env.SLOW_DOWN_WINDOW_MS || '900000', 10), // 15 minutes
    delayAfter: parseInt(process.env.SLOW_DOWN_DELAY_AFTER || '50', 10), // allow 50 requests per 15 minutes, then...
    delayMs: parseInt(process.env.SLOW_DOWN_DELAY_MS || '500', 10), // begin adding 500ms of delay per request above 50
    maxDelayMs: parseInt(process.env.SLOW_DOWN_MAX_DELAY_MS || '20000', 10), // max delay of 20 seconds
  },

  // JWT Security
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'auth-service',
    audience: process.env.JWT_AUDIENCE || 'kanban-app',
  },

  // Password Security
  password: {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8', 10),
    requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE === 'true',
    requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE === 'true',
    requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS === 'true',
    requireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL_CHARS === 'true',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  },

  // Session Security
  session: {
    maxConcurrentSessions: parseInt(process.env.MAX_CONCURRENT_SESSIONS || '5', 10),
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600000', 10), // 1 hour
    refreshTokenRotation: process.env.REFRESH_TOKEN_ROTATION === 'true',
  },

  // IP Control
  ipControl: {
    whitelist: process.env.IP_WHITELIST?.split(',') || [],
    blacklist: process.env.IP_BLACKLIST?.split(',') || [],
    enableGeoBlocking: process.env.ENABLE_GEO_BLOCKING === 'true',
    allowedCountries: process.env.ALLOWED_COUNTRIES?.split(',') || [],
  },

  // Logging Security
  logging: {
    logFailedAttempts: process.env.LOG_FAILED_ATTEMPTS === 'true',
    logSuccessfulLogins: process.env.LOG_SUCCESSFUL_LOGINS === 'true',
    logPasswordChanges: process.env.LOG_PASSWORD_CHANGES === 'true',
    logAccountLockouts: process.env.LOG_ACCOUNT_LOCKOUTS === 'true',
    maskSensitiveData: process.env.MASK_SENSITIVE_DATA === 'true',
    logLevel: process.env.SECURITY_LOG_LEVEL || 'info',
  },

  // Account Lockout
  lockout: {
    enabled: process.env.ACCOUNT_LOCKOUT_ENABLED === 'true',
    maxAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION || '900000', 10), // 15 minutes
    resetAttemptsAfter: parseInt(process.env.RESET_ATTEMPTS_AFTER || '3600000', 10), // 1 hour
  },

  // Two-Factor Authentication
  twoFactor: {
    enabled: process.env.TWO_FACTOR_ENABLED === 'true',
    issuer: process.env.TWO_FACTOR_ISSUER || 'Kanban Auth Service',
    algorithm: process.env.TWO_FACTOR_ALGORITHM || 'sha1',
    digits: parseInt(process.env.TWO_FACTOR_DIGITS || '6', 10),
    period: parseInt(process.env.TWO_FACTOR_PERIOD || '30', 10), // seconds
  },
})); 