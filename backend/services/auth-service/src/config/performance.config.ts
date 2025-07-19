import { registerAs } from '@nestjs/config';

export default registerAs('performance', () => ({
  // Cache Configuration
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutos
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
      queryCacheDuration: parseInt(process.env.QUERY_CACHE_DURATION || '300', 10), // segundos
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
      // No comprimir requests pequeños o ya comprimidos
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
      maxAge: parseInt(process.env.RESPONSE_CACHE_MAX_AGE || '300', 10), // segundos
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
  },

  // Monitoring
  monitoring: {
    // Performance Metrics
    metrics: {
      enabled: process.env.METRICS_ENABLED === 'true',
      interval: parseInt(process.env.METRICS_INTERVAL || '60000', 10), // ms
      includeMemory: process.env.METRICS_INCLUDE_MEMORY === 'true',
      includeCPU: process.env.METRICS_INCLUDE_CPU === 'true',
      includeDatabase: process.env.METRICS_INCLUDE_DATABASE === 'true',
    },

    // Health Checks
    health: {
      enabled: process.env.HEALTH_CHECK_ENABLED === 'true',
      interval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000', 10), // ms
      timeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT || '5000', 10), // ms
    },
  },

  // Optimization Flags
  optimization: {
    // Lazy Loading
    lazyLoading: process.env.LAZY_LOADING === 'true',
    
    // Tree Shaking
    treeShaking: process.env.TREE_SHAKING === 'true',
    
    // Code Splitting
    codeSplitting: process.env.CODE_SPLITTING === 'true',
    
    // Bundle Optimization
    bundleOptimization: process.env.BUNDLE_OPTIMIZATION === 'true',
  },
})); 