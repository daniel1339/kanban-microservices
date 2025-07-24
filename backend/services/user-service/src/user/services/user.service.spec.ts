import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { ProfileDto } from '../dtos/profile.dto';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('getProfile', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should return a profile for valid userId', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const result = await service.getProfile(userId);

      expect(result).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.displayName).toBe('Demo User');
      expect(result.bio).toBe('Demo bio');
      expect(result.id).toBe('profile-id');
      expect(result.created_at).toBeInstanceOf(Date);
      expect(result.updated_at).toBeInstanceOf(Date);
    });

    it('should return consistent profile structure', async () => {
      const userId = 'test-user-id';
      const result = await service.getProfile(userId);

      expect(result).toMatchObject({
        id: expect.any(String),
        userId: expect.any(String),
        displayName: expect.any(String),
        bio: expect.any(String),
        avatarUrl: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });
  });

  describe('updateProfile', () => {
    it('should update profile with provided data', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        displayName: 'Updated Name',
        bio: 'Updated bio',
      };

      const result = await service.updateProfile(userId, updateData);

      expect(result).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.displayName).toBe('Updated Name');
      expect(result.bio).toBe('Updated bio');
      expect(result.updated_at).toBeInstanceOf(Date);
    });

    it('should handle partial updates', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        displayName: 'Partial Update',
      };

      const result = await service.updateProfile(userId, updateData);

      expect(result.displayName).toBe('Partial Update');
      expect(result.bio).toBe('Demo bio'); // Should maintain default value when not provided
    });

    it('should handle empty update data', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {};

      const result = await service.updateProfile(userId, updateData);

      expect(result.displayName).toBe('Demo User'); // Default value
      expect(result.bio).toBe('Demo bio'); // Default value
    });

    it('should update avatarUrl when provided', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updateData = {
        avatarUrl: 'https://example.com/new-avatar.png',
      };

      const result = await service.updateProfile(userId, updateData);

      expect(result.avatarUrl).toBe('https://example.com/new-avatar.png');
    });
  });

  describe('getPublicProfile', () => {
    it('should return public profile for valid userId', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const result = await service.getPublicProfile(userId);

      expect(result).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.displayName).toBe('Demo User');
      expect(result.bio).toBe('Demo bio');
      expect(result.id).toBe('profile-id');
      expect(result.created_at).toBeInstanceOf(Date);
      expect(result.updated_at).toBeInstanceOf(Date);
    });

    it('should return consistent public profile structure', async () => {
      const userId = 'public-user-id';
      const result = await service.getPublicProfile(userId);

      expect(result).toMatchObject({
        id: expect.any(String),
        userId: expect.any(String),
        displayName: expect.any(String),
        bio: expect.any(String),
        avatarUrl: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    it('should handle different userId formats', async () => {
      const userIds = [
        '123e4567-e89b-12d3-a456-426614174000',
        'simple-user-id',
        'user-123',
        'test@example.com',
      ];

      for (const userId of userIds) {
        const result = await service.getPublicProfile(userId);
        expect(result.userId).toBe(userId);
        expect(result).toBeDefined();
      }
    });
  });
}); 