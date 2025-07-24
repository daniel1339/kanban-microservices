import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileDto } from '../dtos/profile.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Request } from 'express';
import { UserService } from '../services/user.service';

describe('ProfileController', () => {
  let controller: ProfileController;

  const mockRequest = {
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      username: 'testuser',
    },
  } as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [UserService],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  describe('getProfile', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should return profile for authenticated user', async () => {
      const result = await controller.getProfile(mockRequest);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        id: 'profile-id',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        displayName: 'Demo User',
        bio: 'Demo bio',
        avatarUrl: 'https://example.com/avatar.png',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    it('should handle request without user', async () => {
      const requestWithoutUser = {} as unknown as Request;
      const result = await controller.getProfile(requestWithoutUser);

      expect(result).toBeDefined();
      expect(result.userId).toBe('user-id'); // Default value
      expect(result.displayName).toBe('Demo User');
    });

    it('should return consistent profile structure', async () => {
      const result = await controller.getProfile(mockRequest);

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

    it('should use user ID from request', async () => {
      const customRequest = {
        user: {
          id: 'custom-user-id',
          email: 'custom@example.com',
        },
      } as unknown as Request;

      const result = await controller.getProfile(customRequest);

      expect(result.userId).toBe('custom-user-id');
    });
  });

  describe('updateProfile', () => {
    it('should update profile with provided data', async () => {
      const updateData: UpdateUserDto = {
        displayName: 'Updated Name',
      };

      const result = await controller.updateProfile(updateData, mockRequest);

      expect(result).toBeDefined();
      expect(result).toMatchObject({
        id: 'profile-id',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        displayName: 'Updated Name',
        bio: 'Demo bio',
        avatarUrl: 'https://example.com/avatar.png',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    it('should handle empty update data', async () => {
      const updateData: UpdateUserDto = {};

      const result = await controller.updateProfile(updateData, mockRequest);

      expect(result).toBeDefined();
      expect(result.displayName).toBe('Demo User'); // Default value
      expect(result.bio).toBe('Demo bio');
    });

    it('should handle partial updates', async () => {
      const updateData: UpdateUserDto = {
        displayName: 'Partial Update',
      };

      const result = await controller.updateProfile(updateData, mockRequest);

      expect(result.displayName).toBe('Partial Update');
      expect(result.bio).toBe('Demo bio'); // Should remain unchanged
    });

    it('should use user ID from request in update', async () => {
      const customRequest = {
        user: {
          id: 'custom-user-id',
        },
      } as unknown as Request;

      const updateData: UpdateUserDto = {
        displayName: 'Custom User',
      };

      const result = await controller.updateProfile(updateData, customRequest);

      expect(result.userId).toBe('custom-user-id');
      expect(result.displayName).toBe('Custom User');
    });

    it('should return consistent structure for updates', async () => {
      const updateData: UpdateUserDto = {
        displayName: 'Test Update',
      };

      const result = await controller.updateProfile(updateData, mockRequest);

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

    it('should handle request without user in update', async () => {
      const requestWithoutUser = {} as unknown as Request;
      const updateData: UpdateUserDto = {
        displayName: 'No User Update',
      };

      const result = await controller.updateProfile(updateData, requestWithoutUser);

      expect(result).toBeDefined();
      expect(result.userId).toBe('user-id'); // Default value
      expect(result.displayName).toBe('No User Update');
    });
  });
}); 