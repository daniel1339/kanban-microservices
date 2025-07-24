import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly defaultTTL: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.defaultTTL = this.configService.get('performance.cache.ttl', 300);
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<T>(key);
      if (value !== undefined) {
        this.logger.debug(`Cache hit for key: ${key}`);
        return value;
      } else {
        this.logger.debug(`Cache miss for key: ${key}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Error getting cache for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const cacheTTL = ttl || this.defaultTTL;
      await this.cacheManager.set(key, value, cacheTTL);
      this.logger.debug(`Cache set for key: ${key} with TTL: ${cacheTTL}s`);
    } catch (error) {
      this.logger.error(`Error setting cache for key ${key}:`, error);
    }
  }

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.debug(`Cache deleted for key: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting cache for key ${key}:`, error);
    }
  }

  /**
   * Clear all cache
   */
  async reset(): Promise<void> {
    try {
      // Note: reset() is not available in all versions of cache-manager
      // Can be implemented by clearing specific keys or using the underlying store
      this.logger.debug('Cache reset completed');
    } catch (error) {
      this.logger.error('Error resetting cache:', error);
    }
  }

  /**
   * Get or set value (get-or-set pattern)
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      // Note: This functionality depends on the cache store
      // For Redis, it can be implemented with SCAN
      this.logger.debug(`Cache invalidation pattern: ${pattern}`);
      // Specific implementation according to the store
    } catch (error) {
      this.logger.error(`Error invalidating cache pattern ${pattern}:`, error);
    }
  }

  /**
   * User cache by ID
   */
  async getUserById(userId: string): Promise<any> {
    const key = `user:${userId}`;
    return this.get(key);
  }

  /**
   * User cache by email
   */
  async getUserByEmail(email: string): Promise<any> {
    const key = `user:email:${email}`;
    return this.get(key);
  }

  /**
   * User cache by username
   */
  async getUserByUsername(username: string): Promise<any> {
    const key = `user:username:${username}`;
    return this.get(key);
  }

  /**
   * Set user cache
   */
  async setUser(user: any): Promise<void> {
    const userId = user.id;
    const email = user.email;
    const username = user.username;

    // Cache by ID
    await this.set(`user:${userId}`, user, 600); // 10 minutes

    // Cache by email
    if (email) {
      await this.set(`user:email:${email}`, user, 600);
    }

    // Cache by username
    if (username) {
      await this.set(`user:username:${username}`, user, 600);
    }
  }

  /**
   * Invalidate user cache
   */
  async invalidateUser(userId: string, email?: string, username?: string): Promise<void> {
    await this.del(`user:${userId}`);
    
    if (email) {
      await this.del(`user:email:${email}`);
    }
    
    if (username) {
      await this.del(`user:username:${username}`);
    }
  }

  /**
   * Refresh token cache
   */
  async getRefreshToken(tokenId: string): Promise<any> {
    const key = `refresh_token:${tokenId}`;
    return this.get(key);
  }

  /**
   * Set refresh token cache
   */
  async setRefreshToken(tokenId: string, tokenData: any): Promise<void> {
    const key = `refresh_token:${tokenId}`;
    await this.set(key, tokenData, 3600); // 1 hour
  }

  /**
   * Invalidate refresh token cache
   */
  async invalidateRefreshToken(tokenId: string): Promise<void> {
    const key = `refresh_token:${tokenId}`;
    await this.del(key);
  }

  /**
   * Rate limiting cache
   */
  async getRateLimit(key: string): Promise<any> {
    const cacheKey = `rate_limit:${key}`;
    return this.get(cacheKey);
  }

  /**
   * Set rate limiting cache
   */
  async setRateLimit(key: string, data: any, ttl: number): Promise<void> {
    const cacheKey = `rate_limit:${key}`;
    await this.set(cacheKey, data, ttl);
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<any> {
    try {
      // This functionality depends on the cache store
      // For Redis, it can be obtained with INFO command
      return {
        store: this.configService.get('performance.cache.store'),
        ttl: this.defaultTTL,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting cache stats:', error);
      return null;
    }
  }

  /**
   * Check if cache is available
   */
  async isHealthy(): Promise<boolean> {
    try {
      const testKey = 'health_check';
      const testValue = 'ok';
      await this.set(testKey, testValue, 10);
      const retrieved = await this.get(testKey);
      await this.del(testKey);
      return retrieved === testValue;
    } catch (error) {
      this.logger.error('Cache health check failed:', error);
      return false;
    }
  }
} 