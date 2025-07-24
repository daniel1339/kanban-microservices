import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { AuthService } from './auth.service';
import { User, RefreshToken } from './entities';
import { RegisterDto, LoginDto } from './dto';
import { CacheService } from '../common/services/cache.service';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let refreshTokenRepository: Repository<RefreshToken>;
  let configService: ConfigService;
  let eventEmitter: EventEmitter2;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(), // <-- agregado para soportar deleteUser
  };

  const mockRefreshTokenRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockCacheService = {
    getUserByEmail: jest.fn(),
    getUserByUsername: jest.fn(),
    getUserById: jest.fn(),
    setUser: jest.fn(),
    invalidateUser: jest.fn(),
    getRefreshToken: jest.fn(),
    setRefreshToken: jest.fn(),
    invalidateRefreshToken: jest.fn(),
    getRateLimit: jest.fn(),
    setRateLimit: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
    getOrSet: jest.fn(),
    invalidatePattern: jest.fn(),
    getStats: jest.fn(),
    isHealthy: jest.fn(),
  };

  const mockEventEmitter = { emit: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: mockRefreshTokenRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    refreshTokenRepository = module.get<Repository<RefreshToken>>(getRepositoryToken(RefreshToken));
    configService = module.get<ConfigService>(ConfigService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    // Configuración por defecto
    mockConfigService.get.mockImplementation((key: string, defaultValue?: any) => {
      const config: Record<string, any> = {
        'jwt.secret': 'test-secret',
        'jwt.expiresIn': '15m',
        'jwt.refreshTokenExpiresIn': '7d',
        'bcrypt.rounds': 12,
      };
      return config[key] || defaultValue;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      passwordConfirmation: 'password123',
    };

    it('should register a new user successfully', async () => {
      // Mock: no existing user
      mockUserRepository.findOne.mockResolvedValue(null);
      
      // Mock: create user
      const mockUser = {
        id: 'user-id',
        email: registerDto.email,
        username: registerDto.username,
        password_hash: 'hashed-password',
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      // Mock: generate tokens
      jest.spyOn(service as any, 'generateTokens').mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(registerDto.email);
      expect(result.user.username).toBe(registerDto.username);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('user.created', expect.objectContaining({
        id: expect.any(String),
        email: expect.any(String),
        username: expect.any(String),
      }));
    });

    it('should throw BadRequestException when passwords do not match', async () => {
      const invalidDto = { ...registerDto, passwordConfirmation: 'different-password' };

      await expect(service.register(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException when email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 'existing-user' });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when username already exists', async () => {
      // First call returns null (email not found), second call returns existing user (username found)
      mockUserRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'existing-user' });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      emailOrUsername: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully with email', async () => {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
        password_hash: hashedPassword,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(service as any, 'generateTokens').mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should login successfully with username', async () => {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
        password_hash: hashedPassword,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(service as any, 'generateTokens').mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await service.login({ ...loginDto, emailOrUsername: 'testuser' });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('wrong-password', 12);
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
        password_hash: hashedPassword,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    const refreshToken = 'valid-refresh-token';

    it('should refresh token successfully', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
        is_verified: true,
      };

      const mockTokenEntity = {
        id: 'token-id',
        user: mockUser,
        token: refreshToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // Future date
      };

      // Mock JWT verification
      jest.spyOn(jwt, 'verify').mockReturnValue({ sub: 'user-id', tokenId: 'token-id' } as any);
      
      // Mock config service for JWT_SECRET
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'JWT_SECRET') return 'test-secret';
        if (key === 'JWT_EXPIRES_IN') return '15m';
        if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
        return undefined;
      });
      
      mockRefreshTokenRepository.findOne.mockResolvedValue(mockTokenEntity);
      jest.spyOn(service as any, 'generateTokens').mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      const result = await service.refreshToken(refreshToken);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Mock config service for JWT_SECRET
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'JWT_SECRET') return 'test-secret';
        return undefined;
      });

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when token entity not found', async () => {
      jest.spyOn(jwt, 'verify').mockReturnValue({ sub: 'user-id', tokenId: 'token-id' } as any);
      mockRefreshTokenRepository.findOne.mockResolvedValue(null);

      // Mock config service for JWT_SECRET
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'JWT_SECRET') return 'test-secret';
        return undefined;
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout successfully when token exists', async () => {
      const userId = 'user-id';
      const refreshToken = 'refresh-token';

      const mockTokenEntity = {
        id: 'token-id',
        user_id: userId,
        token: refreshToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      mockRefreshTokenRepository.findOne.mockResolvedValue(mockTokenEntity);
      mockRefreshTokenRepository.remove.mockResolvedValue(mockTokenEntity);

      await expect(service.logout(userId, refreshToken)).resolves.not.toThrow();
      expect(mockRefreshTokenRepository.findOne).toHaveBeenCalledWith({
        where: {
          user_id: userId,
          token: refreshToken,
        },
      });
      expect(mockRefreshTokenRepository.remove).toHaveBeenCalledWith(mockTokenEntity);
    });

    it('should logout successfully when token does not exist', async () => {
      const userId = 'user-id';
      const refreshToken = 'refresh-token';

      mockRefreshTokenRepository.findOne.mockResolvedValue(null);
      mockRefreshTokenRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.logout(userId, refreshToken)).resolves.not.toThrow();
      expect(mockRefreshTokenRepository.findOne).toHaveBeenCalledWith({
        where: {
          user_id: userId,
          token: refreshToken,
        },
      });
    });
  });

  describe('logoutAll', () => {
    it('should logout all user sessions successfully', async () => {
      const userId = 'user-id';

      mockRefreshTokenRepository.delete.mockResolvedValue({ affected: 3 });

      await expect(service.logoutAll(userId)).resolves.not.toThrow();
      expect(mockRefreshTokenRepository.delete).toHaveBeenCalledWith({
        user_id: userId,
      });
    });
  });

  describe('cleanupExpiredTokens', () => {
    it('should cleanup expired tokens successfully', async () => {
      const mockExpiredTokens = [
        { id: 'token-1', user_id: 'user-1', token: 'expired-token-1', expires_at: new Date(Date.now() - 1000) },
        { id: 'token-2', user_id: 'user-2', token: 'expired-token-2', expires_at: new Date(Date.now() - 2000) },
      ];

      const mockQueryBuilder = {
        createQueryBuilder: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockExpiredTokens),
      };

      mockRefreshTokenRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder);
      mockRefreshTokenRepository.remove.mockResolvedValue(mockExpiredTokens);

      const result = await service.cleanupExpiredTokens();

      expect(result).toBe(2);
      expect(mockRefreshTokenRepository.remove).toHaveBeenCalledWith(mockExpiredTokens);
    });

    it('should return 0 when no expired tokens found', async () => {
      const mockQueryBuilder = {
        createQueryBuilder: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockRefreshTokenRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder);

      const result = await service.cleanupExpiredTokens();

      expect(result).toBe(0);
      expect(mockRefreshTokenRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should validate user successfully', async () => {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
        password_hash: hashedPassword,
        is_verified: true,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toBeDefined();
      expect(result.id).toBe('user-id');
      expect(result.password_hash).toBeUndefined(); // Should be excluded
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent@example.com', 'password123');

      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('wrong-password', 12);
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
        password_hash: hashedPassword,
        is_verified: true,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toBeNull();
    });
  });

  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      const userId = 'user-id';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        username: 'testuser',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getProfile(userId);

      expect(result).toBeDefined();
      expect(result.id).toBe(userId);
      expect(result.email).toBe('test@example.com');
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 'nonexistent-user';
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update user and emit user.updated event', async () => {
      const userId = 'user-id';
      const updateDto = { email: 'new@example.com', username: 'newuser' };
      const existingUser = {
        id: userId,
        email: 'old@example.com',
        username: 'olduser',
        password_hash: 'hash',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const updatedUser = { ...existingUser, ...updateDto };
      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(userId, updateDto);
      expect(result.email).toBe(updateDto.email);
      expect(result.username).toBe(updateDto.username);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('user.updated', expect.objectContaining({
        id: userId,
        email: updateDto.email,
        username: updateDto.username,
      }));
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.updateUser('nonexistent', { email: 'x' })).rejects.toThrow('User not found');
    });
  });

  describe('deleteUser', () => {
    it('should delete user and emit user.deleted event', async () => {
      const userId = 'user-id';
      const existingUser = {
        id: userId,
        email: 'test@example.com',
        username: 'testuser',
        password_hash: 'hash',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.remove.mockResolvedValue(existingUser);

      await service.deleteUser(userId);
      expect(mockUserRepository.remove).toHaveBeenCalledWith(existingUser);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('user.deleted', { id: userId });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.deleteUser('nonexistent')).rejects.toThrow('User not found');
    });
  });
}); 