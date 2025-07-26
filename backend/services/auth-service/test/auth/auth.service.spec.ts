import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../src/auth/auth.service';
import { User } from '../../src/auth/entities/user.entity';
import { RefreshToken } from '../../src/auth/entities/refresh-token.entity';
import { CacheService } from '../../src/common/services/cache.service';
import { UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: any;
  let refreshTokenRepository: any;
  let configService: any;
  let cacheService: any;

  const mockUser = {
    id: 'user-id-1',
    email: 'test@example.com',
    username: 'testuser',
    password_hash: 'hashed-password',
    is_verified: true,
    first_name: 'Test',
    last_name: 'User',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockRefreshToken = {
    id: 'token-id-1',
    user_id: 'user-id-1',
    token: 'refresh-token-123',
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    is_revoked: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            getUserByEmail: jest.fn(),
            getUserByUsername: jest.fn(),
            setUser: jest.fn(),
            getUserById: jest.fn(),
            setRefreshToken: jest.fn(),
            getRefreshToken: jest.fn(),
            deleteRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    refreshTokenRepository = module.get(getRepositoryToken(RefreshToken));
    configService = module.get<ConfigService>(ConfigService);
    cacheService = module.get<CacheService>(CacheService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'new@example.com',
        username: 'newuser',
        password: 'Valid123!', // Updated to match new rule
        passwordConfirmation: 'Valid123!',
      };

      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);
      configService.get.mockReturnValue(12);

      const result = await service.register(registerDto);

      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.expiresIn).toBe(900);
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        username: 'existinguser',
        password: 'Valid123!', // Updated to match new rule
        passwordConfirmation: 'Valid123!',
      };

      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const registerDto = {
        email: 'new@example.com',
        username: 'newuser',
        password: 'Valid123!', // Updated to match new rule
        passwordConfirmation: 'DifferentPassword123!',
      };

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login user with email successfully', async () => {
      const loginDto = {
        emailOrUsername: 'test@example.com',
        password: 'Password123!',
      };

      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.expiresIn).toBe(900);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto = {
        emailOrUsername: 'nonexistent@example.com',
        password: 'Password123!',
      };

      userRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const userId = 'user-id-1';
      const refreshToken = 'refresh-token-123';

      refreshTokenRepository.findOne.mockResolvedValue(mockRefreshToken);
      refreshTokenRepository.remove.mockResolvedValue(undefined);

      await service.logout(userId, refreshToken);

      expect(refreshTokenRepository.findOne).toHaveBeenCalledWith({
        where: {
          user_id: userId,
          token: refreshToken,
        },
      });
    });
  });

  describe('logoutAll', () => {
    it('should logout all user sessions successfully', async () => {
      const userId = 'user-id-1';

      refreshTokenRepository.delete.mockResolvedValue({ affected: 2 });

      await service.logoutAll(userId);

      expect(refreshTokenRepository.delete).toHaveBeenCalledWith({ user_id: userId });
    });
  });

  describe('validateUser', () => {
    it('should validate user with email successfully', async () => {
      const emailOrUsername = 'test@example.com';
      const password = 'Password123!';

      cacheService.getUserByEmail.mockResolvedValue(null);
      cacheService.getUserByUsername.mockResolvedValue(null);
      userRepository.findOne.mockResolvedValue(mockUser);
      cacheService.setUser.mockResolvedValue(undefined);

      const result = await service.validateUser(emailOrUsername, password);

      expect(result).toBeDefined();
    });

    it('should return null for non-existent user', async () => {
      const emailOrUsername = 'nonexistent@example.com';
      const password = 'Password123!';

      cacheService.getUserByEmail.mockResolvedValue(null);
      cacheService.getUserByUsername.mockResolvedValue(null);
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser(emailOrUsername, password);

      expect(result).toBeNull();
    });
  });

  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      const userId = 'user-id-1';

      cacheService.getUserById.mockResolvedValue(null);
      userRepository.findOne.mockResolvedValue(mockUser);
      cacheService.setUser.mockResolvedValue(undefined);

      const result = await service.getProfile(userId);

      expect(result).toBeDefined();
      expect(result.id).toBe(userId);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const userId = 'non-existent-user-id';

      cacheService.getUserById.mockResolvedValue(null);
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile(userId)).rejects.toThrow(UnauthorizedException);
    });
  });
}); 