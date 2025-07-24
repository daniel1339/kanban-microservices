import { registerAs } from '@nestjs/config';

export default registerAs('performance', () => ({
  // Cache Configuration
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutes
    maxItems: parseInt(process.env.CACHE_MAX_ITEMS || '100', 10),
    store: process.env.CACHE_STORE || 'memory', // memory, redis
    prefix: process.env.CACHE_PREFIX || 'auth-service',
    
    // Redis Configuration
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0', 10),
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'auth:',
      retryDelayOnFailover: parseInt(process.env.REDIS_RETRY_DELAY || '100', 10),
      maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
    },
  },

  // Database Performance
  database: {
    // Connection Pool
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2', 10),
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
      acquireTimeoutMillis: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '30000', 10),
      createTimeoutMillis: parseInt(process.env.DB_CREATE_TIMEOUT || '30000', 10),
      destroyTimeoutMillis: parseInt(process.env.DB_DESTROY_TIMEOUT || '5000', 10),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
      reapIntervalMillis: parseInt(process.env.DB_REAP_INTERVAL || '1000', 10),
    },

    // Query Optimization
    query: {
      slowQueryThreshold: parseInt(process.env.SLOW_QUERY_THRESHOLD || '1000', 10), // ms
      logSlowQueries: process.env.LOG_SLOW_QUERIES === 'true',
      enableQueryCache: process.env.ENABLE_QUERY_CACHE === 'true',
      queryCacheDuration: parseInt(process.env.QUERY_CACHE_DURATION || '300', 10), // seconds
    },

    // Indexes
    indexes: {
      autoCreate: process.env.AUTO_CREATE_INDEXES === 'true',
      autoUpdate: process.env.AUTO_UPDATE_INDEXES === 'true',
    },
  },

  // Compression Configuration
  compression: {
    enabled: process.env.COMPRESSION_ENABLED === 'true',
    level: parseInt(process.env.COMPRESSION_LEVEL || '6', 10), // 0-9
    threshold: parseInt(process.env.COMPRESSION_THRESHOLD || '1024', 10), // bytes
    filter: (req: any, res: any) => {
      // Don't compress small requests or already compressed ones
      if (req.headers['content-length'] && parseInt(req.headers['content-length']) < 1024) {
        return false;
      }
      if (req.headers['content-encoding']) {
        return false;
      }
      return true;
    },
  },

  // Response Optimization
  response: {
    // ETags
    etags: process.env.ENABLE_ETAGS === 'true',
    
    // Gzip Compression
    gzip: {
      enabled: process.env.GZIP_ENABLED === 'true',
      level: parseInt(process.env.GZIP_LEVEL || '6', 10),
      threshold: parseInt(process.env.GZIP_THRESHOLD || '1024', 10),
    },

    // Response Caching
    cache: {
      enabled: process.env.RESPONSE_CACHE_ENABLED === 'true',
      maxAge: parseInt(process.env.RESPONSE_CACHE_MAX_AGE || '300', 10), // seconds
      private: process.env.RESPONSE_CACHE_PRIVATE === 'true',
    },
  },

  // Memory Management
  memory: {
    // Garbage Collection
    gc: {
      enabled: process.env.GC_ENABLED === 'true',
      interval: parseInt(process.env.GC_INTERVAL || '30000', 10), // ms
    },

    // Memory Limits
    limits: {
      maxHeapSize: process.env.MAX_HEAP_SIZE || '512m',
      maxOldSpaceSize: process.env.MAX_OLD_SPACE_SIZE || '256m',
    },

    // Memory Monitoring
    monitoring: {
      enabled: process.env.MEMORY_MONITORING_ENABLED === 'true',
      interval: parseInt(process.env.MEMORY_MONITORING_INTERVAL || '60000', 10), // ms
      threshold: parseInt(process.env.MEMORY_MONITORING_THRESHOLD || '80', 10), // percentage
    },
  },

  // Request Processing
  request: {
    // Timeout Configuration
    timeout: {
      request: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10), // ms
      response: parseInt(process.env.RESPONSE_TIMEOUT || '30000', 10), // ms
    },

    // Rate Limiting
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
      skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESSFUL === 'true',
      skipFailedRequests: process.env.RATE_LIMIT_SKIP_FAILED === 'true',
    },

    // Request Size Limits
    size: {
      maxBodySize: process.env.MAX_BODY_SIZE || '10mb',
      maxFileSize: process.env.MAX_FILE_SIZE || '5mb',
    },
  },

  // Monitoring and Metrics
  monitoring: {
    // Performance Metrics
    metrics: {
      enabled: process.env.PERFORMANCE_METRICS_ENABLED === 'true',
      interval: parseInt(process.env.METRICS_INTERVAL || '60000', 10), // ms
      retention: parseInt(process.env.METRICS_RETENTION || '86400000', 10), // 24 hours
    },

    // Health Checks
    health: {
      enabled: process.env.HEALTH_CHECK_ENABLED === 'true',
      interval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000', 10), // ms
      timeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT || '5000', 10), // ms
    },

    // Logging
    logging: {
      performance: process.env.PERFORMANCE_LOGGING_ENABLED === 'true',
      slowQueries: process.env.SLOW_QUERIES_LOGGING_ENABLED === 'true',
      memoryUsage: process.env.MEMORY_USAGE_LOGGING_ENABLED === 'true',
    },
  },
})); 