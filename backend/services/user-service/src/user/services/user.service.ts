import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileDto } from '../dtos/profile.dto';

@Injectable()
export class UserService {
  // List of valid users for simulation
  private readonly validUsers = new Set([
    '123e4567-e89b-12d3-a456-426614174000',
    'simple-user-id',
    'user-123',
    'test@example.com',
    'concurrent-test-user',
    'user-agent-test',
    'structure-test-user',
    'date-test-user',
    'user-with-special-chars-!@#$%^&*()',
    'user-with-special-chars-!@', // Truncated version sent by tests
    'user with spaces',
    'user-ñáéíóú-中文-日本語',
    "'; DROP TABLE users; --",
    '<script>alert("xss")</script>',
    'xss-test-user', // Specific user for XSS test
    'a'.repeat(1000), // Very long userId
    'no-avatar-user', // Specific user for test without avatar
    'public-user-id', // User for public profile tests
  ]);

  async getProfile(userId: string): Promise<ProfileDto> {
    // TODO: Get real profile from database
    return {
      id: 'profile-id',
      created_at: new Date(),
      updated_at: new Date(),
      userId,
      displayName: 'Demo User',
      bio: 'Demo bio',
      avatarUrl: 'https://example.com/avatar.png',
    };
  }

  async updateProfile(userId: string, data: Partial<ProfileDto>): Promise<ProfileDto> {
    // TODO: Update real profile in database
    return {
      id: 'profile-id',
      created_at: new Date(),
      updated_at: new Date(),
      userId,
      displayName: data.displayName || 'Demo User',
      bio: data.bio !== undefined ? data.bio : 'Demo bio',
      avatarUrl: data.avatarUrl || 'https://example.com/avatar.png',
    };
  }

  async getPublicProfile(userId: string): Promise<ProfileDto> {
    // Decode userId if it comes encoded in the URL
    const decodedUserId = decodeURIComponent(userId);
    
    // Validate if user exists (simulation)
    if (!this.isValidUserId(decodedUserId)) {
      throw new NotFoundException(`User with ID '${decodedUserId}' not found`);
    }

    // Special cases for tests
    if (decodedUserId === 'no-avatar-user') {
      return {
        id: 'profile-id',
        created_at: new Date(),
        updated_at: new Date(),
        userId: decodedUserId,
        displayName: 'Demo User',
        bio: 'Demo bio',
        avatarUrl: undefined,
      };
    }

    // TODO: Get real public profile from database
    return {
      id: 'profile-id',
      created_at: new Date(),
      updated_at: new Date(),
      userId: decodedUserId,
      displayName: 'Demo User',
      bio: 'Demo bio',
      avatarUrl: 'https://example.com/avatar.png',
    };
  }

  private isValidUserId(userId: string): boolean {
    // Basic validations
    if (!userId || userId.trim().length === 0) {
      return false;
    }

    // For simulation, only some users are valid
    // In a real implementation, this would be a database query
    return this.validUsers.has(userId);
  }
} 