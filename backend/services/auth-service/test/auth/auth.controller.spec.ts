import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from '../../src/auth/dto';
import { UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { CurrentUser } from '../../src/auth/decorators/current-user.decorator';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;

  const mockUser = {
    id: 'user-id-1',
    email: 'test@example.com',
    username: 'testuser',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthResponse = {
    user: mockUser,
    accessToken: 'access-token-123',
    refreshToken: 'refresh-token-123',
    expiresIn: 900,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn(),
            logout: jest.fn(),
            logoutAll: jest.fn(),
            getProfile: jest.fn(),
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'new@example.com',
        username: 'newuser',
        password: 'Password123!',
        passwordConfirmation: 'Password123!',
      };

      authService.register.mockResolvedValue(mockAuthResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        username: 'existinguser',
        password: 'Password123!',
        passwordConfirmation: 'Password123!',
      };

      authService.register.mockRejectedValue(new ConflictException('El email ya está registrado'));

      await expect(controller.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const registerDto: RegisterDto = {
        email: 'new@example.com',
        username: 'newuser',
        password: 'Password123!',
        passwordConfirmation: 'DifferentPassword123!',
      };

      authService.register.mockRejectedValue(new BadRequestException('Las contraseñas no coinciden'));

      await expect(controller.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto: LoginDto = {
        emailOrUsername: 'test@example.com',
        password: 'Password123!',
      };

      authService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        emailOrUsername: 'test@example.com',
        password: 'WrongPassword123!',
      };

      authService.login.mockRejectedValue(new UnauthorizedException('Credenciales inválidas'));

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'valid-refresh-token',
      };

      authService.refreshToken.mockResolvedValue(mockAuthResponse);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(result).toEqual(mockAuthResponse);
      expect(authService.refreshToken).toHaveBeenCalledWith(refreshTokenDto.refreshToken);
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'invalid-refresh-token',
      };

      authService.refreshToken.mockRejectedValue(new UnauthorizedException('Refresh token inválido'));

      await expect(controller.refreshToken(refreshTokenDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const mockUser: CurrentUser = { 
        id: 'user-id-1', 
        email: 'test@example.com', 
        username: 'testuser' 
      };
      const refreshTokenDto = { refreshToken: 'refresh-token-123' };

      authService.logout.mockResolvedValue(undefined);

      await controller.logout(mockUser, refreshTokenDto);

      expect(authService.logout).toHaveBeenCalledWith(mockUser.id, refreshTokenDto.refreshToken);
    });
  });

  describe('logoutAll', () => {
    it('should logout all user sessions successfully', async () => {
      const mockUser: CurrentUser = { 
        id: 'user-id-1', 
        email: 'test@example.com', 
        username: 'testuser' 
      };

      authService.logoutAll.mockResolvedValue(undefined);

      await controller.logoutAll(mockUser);

      expect(authService.logoutAll).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      const mockUser: CurrentUser = { 
        id: 'user-id-1', 
        email: 'test@example.com', 
        username: 'testuser' 
      };

      authService.getProfile.mockResolvedValue(mockUser);

      const result = await controller.getProfile(mockUser);

      expect(result).toEqual(mockUser);
      expect(authService.getProfile).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const mockUser: CurrentUser = { 
        id: 'non-existent-user-id', 
        email: 'test@example.com', 
        username: 'testuser' 
      };

      authService.getProfile.mockRejectedValue(new UnauthorizedException('Usuario no encontrado'));

      await expect(controller.getProfile(mockUser)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should validate user successfully', async () => {
      const loginDto = {
        emailOrUsername: 'test@example.com',
        password: 'Password123!',
      };

      authService.validateUser.mockResolvedValue(mockUser);

      const result = await controller.validateUser(loginDto);

      expect(result).toEqual({ isValid: true });
      expect(authService.validateUser).toHaveBeenCalledWith(loginDto.emailOrUsername, loginDto.password);
    });

    it('should return invalid for non-existent user', async () => {
      const loginDto = {
        emailOrUsername: 'nonexistent@example.com',
        password: 'Password123!',
      };

      authService.validateUser.mockResolvedValue(null);

      const result = await controller.validateUser(loginDto);

      expect(result).toEqual({ isValid: false });
    });
  });
}); 