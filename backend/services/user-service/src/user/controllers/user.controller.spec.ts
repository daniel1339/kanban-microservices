import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { ProfileDto } from '../dtos/profile.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    getPublicProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getUserById', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should return public profile for valid userId', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const mockProfile: ProfileDto = {
        id: 'profile-id',
        userId,
        displayName: 'Test User',
        bio: 'Test bio',
        avatarUrl: 'https://example.com/avatar.png',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUserService.getPublicProfile.mockResolvedValue(mockProfile);

      const result = await controller.getUserById(userId);

      expect(result).toBeDefined();
      expect(result).toEqual(mockProfile);
      expect(userService.getPublicProfile).toHaveBeenCalledWith(userId);
    });

    it('should handle different userId formats', async () => {
      const userIds = [
        '123e4567-e89b-12d3-a456-426614174000',
        'simple-user-id',
        'user-123',
        'test@example.com',
      ];

      for (const userId of userIds) {
        const mockProfile: ProfileDto = {
          id: 'profile-id',
          userId,
          displayName: 'Test User',
          bio: 'Test bio',
          avatarUrl: undefined,
          created_at: new Date(),
          updated_at: new Date(),
        };

        mockUserService.getPublicProfile.mockResolvedValue(mockProfile);

        const result = await controller.getUserById(userId);

        expect(result.userId).toBe(userId);
        expect(userService.getPublicProfile).toHaveBeenCalledWith(userId);
      }
    });

    it('should return consistent profile structure', async () => {
      const userId = 'test-user-id';
      const mockProfile: ProfileDto = {
        id: 'profile-id',
        userId,
        displayName: 'Test User',
        bio: 'Test bio',
        avatarUrl: 'https://example.com/avatar.png',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUserService.getPublicProfile.mockResolvedValue(mockProfile);

      const result = await controller.getUserById(userId);

      expect(result).toMatchObject({
        id: expect.any(String),
        userId: expect.any(String),
        displayName: expect.any(String),
        bio: expect.any(String),
        avatarUrl: expect.anything(),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });

    it('should handle service errors gracefully', async () => {
      const userId = 'invalid-user-id';
      const error = new Error('User not found');

      mockUserService.getPublicProfile.mockRejectedValue(error);

      await expect(controller.getUserById(userId)).rejects.toThrow('User not found');
      expect(userService.getPublicProfile).toHaveBeenCalledWith(userId);
    });

    it('should handle empty userId', async () => {
      const userId = '';
      const mockProfile: ProfileDto = {
        id: 'profile-id',
        userId,
        displayName: 'Test User',
        bio: 'Test bio',
        avatarUrl: undefined,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUserService.getPublicProfile.mockResolvedValue(mockProfile);

      const result = await controller.getUserById(userId);

      expect(result.userId).toBe('');
      expect(userService.getPublicProfile).toHaveBeenCalledWith(userId);
    });

    it('should handle profile without avatar', async () => {
      const userId = 'no-avatar-user';
      const mockProfile: ProfileDto = {
        id: 'profile-id',
        userId,
        displayName: 'Test User',
        bio: 'Test bio',
        avatarUrl: undefined,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUserService.getPublicProfile.mockResolvedValue(mockProfile);

      const result = await controller.getUserById(userId);

      expect(result.avatarUrl).toBeUndefined();
      expect(result.displayName).toBe('Test User');
    });
  });
}); 