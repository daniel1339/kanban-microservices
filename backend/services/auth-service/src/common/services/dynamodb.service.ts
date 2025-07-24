import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

export interface RefreshTokenItem {
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
  deviceInfo?: string;
  ipAddress?: string;
}

export interface UserSessionItem {
  sessionId: string;
  userId: string;
  createdAt: string;
  lastActivity: string;
  deviceInfo?: string;
  ipAddress?: string;
  isActive: boolean;
}

export interface RateLimitItem {
  key: string;
  count: number;
  expiresAt: string;
  windowStart: string;
}

@Injectable()
export class DynamoDBService {
  private readonly logger = new Logger(DynamoDBService.name);
  private readonly docClient: DynamoDBDocumentClient;
  private readonly dynamoClient: DynamoDBClient;

  constructor(private readonly configService: ConfigService) {
    const isLocal = this.configService.get<string>('NODE_ENV') === 'development';
    
    const clientConfig: any = {
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', 'test'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY', 'test'),
      },
    };

    // Configure local endpoint if we're in development
    if (isLocal) {
      clientConfig.endpoint = this.configService.get<string>('AWS_ENDPOINT', 'http://localhost:4566');
      this.logger.log('Using LocalStack DynamoDB endpoint');
    }

    const dynamoClient = new DynamoDBClient(clientConfig);
    this.dynamoClient = dynamoClient;
    this.docClient = DynamoDBDocumentClient.from(dynamoClient);
  }

  // ========================================
  // REFRESH TOKENS OPERATIONS
  // ========================================

  async saveRefreshToken(tokenData: RefreshTokenItem): Promise<void> {
    try {
      const command = new PutCommand({
        TableName: 'kanban-refresh-tokens',
        Item: tokenData,
      });

      await this.docClient.send(command);
      this.logger.debug(`Refresh token saved for user ${tokenData.userId}`);
    } catch (error) {
      this.logger.error('Error saving refresh token:', error);
      throw error;
    }
  }

  async getRefreshToken(token: string): Promise<RefreshTokenItem | null> {
    try {
      const command = new GetCommand({
        TableName: 'kanban-refresh-tokens',
        Key: { token },
      });

      const response = await this.docClient.send(command);
      return response.Item as RefreshTokenItem || null;
    } catch (error) {
      this.logger.error('Error getting refresh token:', error);
      throw error;
    }
  }

  async deleteRefreshToken(token: string): Promise<void> {
    try {
      const command = new DeleteCommand({
        TableName: 'kanban-refresh-tokens',
        Key: { token },
      });

      await this.docClient.send(command);
      this.logger.debug(`Refresh token deleted: ${token}`);
    } catch (error) {
      this.logger.error('Error deleting refresh token:', error);
      throw error;
    }
  }

  async deleteUserRefreshTokens(userId: string): Promise<void> {
    try {
      const command = new QueryCommand({
        TableName: 'kanban-refresh-tokens',
        IndexName: 'user-token-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      });

      const response = await this.docClient.send(command);
      const tokens = response.Items || [];

      // Delete all user tokens
      const deletePromises = tokens.map(token => 
        this.deleteRefreshToken(token.token)
      );

      await Promise.all(deletePromises);
      this.logger.debug(`Deleted ${tokens.length} refresh tokens for user ${userId}`);
    } catch (error) {
      this.logger.error('Error deleting user refresh tokens:', error);
      throw error;
    }
  }

  // ========================================
  // USER SESSIONS OPERATIONS
  // ========================================

  async createUserSession(sessionData: UserSessionItem): Promise<void> {
    try {
      const command = new PutCommand({
        TableName: 'kanban-user-sessions',
        Item: sessionData,
      });

      await this.docClient.send(command);
      this.logger.debug(`User session created: ${sessionData.sessionId}`);
    } catch (error) {
      this.logger.error('Error creating user session:', error);
      throw error;
    }
  }

  async getUserSession(sessionId: string): Promise<UserSessionItem | null> {
    try {
      const command = new GetCommand({
        TableName: 'kanban-user-sessions',
        Key: { sessionId },
      });

      const response = await this.docClient.send(command);
      return response.Item as UserSessionItem || null;
    } catch (error) {
      this.logger.error('Error getting user session:', error);
      throw error;
    }
  }

  async updateUserSessionActivity(sessionId: string): Promise<void> {
    try {
      const command = new UpdateCommand({
        TableName: 'kanban-user-sessions',
        Key: { sessionId },
        UpdateExpression: 'SET lastActivity = :lastActivity',
        ExpressionAttributeValues: {
          ':lastActivity': new Date().toISOString(),
        },
      });

      await this.docClient.send(command);
    } catch (error) {
      this.logger.error('Error updating user session activity:', error);
      throw error;
    }
  }

  async deleteUserSession(sessionId: string): Promise<void> {
    try {
      const command = new DeleteCommand({
        TableName: 'kanban-user-sessions',
        Key: { sessionId },
      });

      await this.docClient.send(command);
      this.logger.debug(`User session deleted: ${sessionId}`);
    } catch (error) {
      this.logger.error('Error deleting user session:', error);
      throw error;
    }
  }

  async getUserSessions(userId: string): Promise<UserSessionItem[]> {
    try {
      const command = new QueryCommand({
        TableName: 'kanban-user-sessions',
        IndexName: 'user-sessions-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      });

      const response = await this.docClient.send(command);
      return response.Items as UserSessionItem[] || [];
    } catch (error) {
      this.logger.error('Error getting user sessions:', error);
      throw error;
    }
  }

  // ========================================
  // RATE LIMITING OPERATIONS
  // ========================================

  async incrementRateLimit(key: string, windowSeconds: number): Promise<{ count: number; isAllowed: boolean }> {
    try {
      const now = new Date();
      const windowStart = new Date(now.getTime() - (windowSeconds * 1000));
      const expiresAt = new Date(now.getTime() + (windowSeconds * 1000));

      const command = new UpdateCommand({
        TableName: 'kanban-rate-limits',
        Key: { key },
        UpdateExpression: 'SET #count = if_not_exists(#count, :zero) + :incr, windowStart = :windowStart, expiresAt = :expiresAt',
        ExpressionAttributeNames: {
          '#count': 'count',
        },
        ExpressionAttributeValues: {
          ':incr': 1,
          ':zero': 0,
          ':windowStart': windowStart.toISOString(),
          ':expiresAt': expiresAt.toISOString(),
        },
        ReturnValues: 'UPDATED_NEW',
      });

      const response = await this.docClient.send(command);
      const count = response.Attributes?.count || 0;

      // For now, we allow up to 100 requests per window
      const isAllowed = count <= 100;

      this.logger.debug(`Rate limit for ${key}: ${count}/100 (${isAllowed ? 'allowed' : 'blocked'})`);
      
      return { count, isAllowed };
    } catch (error) {
      this.logger.error('Error incrementing rate limit:', error);
      // In case of error, allow the request
      return { count: 0, isAllowed: true };
    }
  }

  async getRateLimit(key: string): Promise<RateLimitItem | null> {
    try {
      const command = new GetCommand({
        TableName: 'kanban-rate-limits',
        Key: { key },
      });

      const response = await this.docClient.send(command);
      return response.Item as RateLimitItem || null;
    } catch (error) {
      this.logger.error('Error getting rate limit:', error);
      return null;
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  async close(): Promise<void> {
    if (this.dynamoClient) {
      await this.dynamoClient.destroy();
      this.logger.log('DynamoDB client destroyed');
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const command = new GetCommand({
        TableName: 'kanban-refresh-tokens',
        Key: { token: 'health-check' },
      });

      await this.docClient.send(command);
      return true;
    } catch (error) {
      this.logger.error('DynamoDB health check failed:', error);
      return false;
    }
  }

  async cleanupExpiredTokens(): Promise<number> {
    try {
      const now = new Date().toISOString();
      
      const command = new QueryCommand({
        TableName: 'kanban-refresh-tokens',
        IndexName: 'user-token-index',
        KeyConditionExpression: 'expiresAt < :now',
        ExpressionAttributeValues: {
          ':now': now,
        },
      });

      const response = await this.docClient.send(command);
      const expiredTokens = response.Items || [];

      // Delete expired tokens
      const deletePromises = expiredTokens.map(token => 
        this.deleteRefreshToken(token.token)
      );

      await Promise.all(deletePromises);
      
      this.logger.log(`Cleaned up ${expiredTokens.length} expired tokens`);
      return expiredTokens.length;
    } catch (error) {
      this.logger.error('Error cleaning up expired tokens:', error);
      return 0;
    }
  }
} 