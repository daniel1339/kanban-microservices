import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { 
  mockRegisterDto, 
  mockLoginDto, 
  mockRefreshTokenDto, 
  mockAuthResponse, 
  mockJwtPayload,
  mockUserResponse 
} from '../../test/fixtures';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
    validateUser: jest.fn(),
    getProfile: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([{
          ttl: 60000,
          limit: 10,
        }]),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockAuthService.register.mockResolvedValue(mockAuthResponse);

      const result = await controller.register(mockRegisterDto);

      expect(authService.register).toHaveBeenCalledWith(mockRegisterDto);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(mockLoginDto);

      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      mockAuthService.refreshToken.mockResolvedValue(mockAuthResponse);

      const result = await controller.refreshToken(mockRefreshTokenDto);

      expect(authService.refreshToken).toHaveBeenCalledWith(mockRefreshTokenDto.refreshToken);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockAuthService.logout.mockResolvedValue(undefined);

      await controller.logout(mockJwtPayload, mockRefreshTokenDto);

      expect(authService.logout).toHaveBeenCalledWith(mockJwtPayload.id, mockRefreshTokenDto.refreshToken);
    });
  });

  describe('validateUser', () => {
    it('should validate user successfully when credentials are valid', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
      };
      mockAuthService.validateUser.mockResolvedValue(mockUser);

      const result = await controller.validateUser(mockLoginDto);

      expect(authService.validateUser).toHaveBeenCalledWith(
        mockLoginDto.emailOrUsername,
        mockLoginDto.password,
      );
      expect(result).toEqual({ isValid: true });
    });

    it('should return false when credentials are invalid', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);

      const result = await controller.validateUser(mockLoginDto);

      expect(authService.validateUser).toHaveBeenCalledWith(
        mockLoginDto.emailOrUsername,
        mockLoginDto.password,
      );
      expect(result).toEqual({ isValid: false });
    });
  });

  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      mockAuthService.getProfile.mockResolvedValue(mockUserResponse);

      const result = await controller.getProfile(mockJwtPayload);

      expect(authService.getProfile).toHaveBeenCalledWith(mockJwtPayload.id);
      expect(result).toEqual(mockUserResponse);
    });
  });
}); 