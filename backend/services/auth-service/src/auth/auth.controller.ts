import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiBearerAuth, 
  ApiBody, 
  ApiParam,
  ApiHeader,
  ApiConsumes,
  ApiProduces
} from '@nestjs/swagger';
import { ThrottleLogin, ThrottleRegister, ThrottleRefresh, ThrottleValidate } from '../common/decorators/throttle.decorator';
import { ThrottlerGuard } from '@nestjs/throttler';

import {
  RegisterRequestExample,
  LoginRequestExample,
  LoginUsernameRequestExample,
  RefreshTokenRequestExample,
  ValidateCredentialsRequestExample,
} from '../docs/examples/auth.examples';
import {
  RegisterResponse,
  LoginResponse,
  RefreshTokenResponse,
  ProfileResponse,
  ValidateCredentialsResponse,
  LogoutResponse,
  LogoutAllResponse,
  ValidationErrorResponse,
  UnauthorizedErrorResponse,
  ConflictErrorResponse,
  NotFoundErrorResponse,
  RateLimitErrorResponse,
  InternalServerErrorResponse,
} from '../docs/responses/auth.responses';

import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';
import { AuthResponse } from './interfaces/auth.interface';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @UseGuards(ThrottlerGuard)
  @ThrottleRegister()
  @ApiOperation({ 
    summary: 'User registration',
    description: 'Creates a new user. Returns the user and JWT tokens. Password must meet security requirements.'
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Registration data',
    examples: {
      'Successful registration': RegisterRequestExample,
      'Validation error': {
        summary: 'Validation error',
        description: 'Example of validation error',
        value: {
          email: 'no-es-email',
          username: 'us',
          password: '123',
          passwordConfirmation: '456'
        }
      }
    }
  })
  @RegisterResponse()
  @ValidationErrorResponse()
  @ConflictErrorResponse()
  @RateLimitErrorResponse()
  @InternalServerErrorResponse()
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @UseGuards(ThrottlerGuard)
  @ThrottleLogin()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates using email/username and password. Returns accessToken and refreshToken.'
  })
  @ApiBody({
    type: LoginDto,
    description: 'Login credentials',
    examples: {
      'Login with email': LoginRequestExample,
      'Login with username': LoginUsernameRequestExample,
      'Invalid credentials': {
        summary: 'Invalid credentials',
        description: 'Example of invalid credentials error',
        value: {
          emailOrUsername: 'usuario@ejemplo.com',
          password: 'incorrecta'
        }
      }
    }
  })
  @LoginResponse()
  @ValidationErrorResponse()
  @UnauthorizedErrorResponse()
  @RateLimitErrorResponse()
  @InternalServerErrorResponse()
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @Public()
  @UseGuards(ThrottlerGuard)
  @ThrottleRefresh()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renew accessToken',
    description: 'Returns a new accessToken and refreshToken if the refreshToken is valid.'
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Valid refresh token',
    examples: {
      'Valid refresh token': RefreshTokenRequestExample,
      'Token error': {
        summary: 'Invalid token',
        description: 'Example of refresh token error',
        value: {
          refreshToken: 'token-invalido'
        }
      }
    }
  })
  @RefreshTokenResponse()
  @ValidationErrorResponse()
  @UnauthorizedErrorResponse()
  @RateLimitErrorResponse()
  @InternalServerErrorResponse()
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout',
    description: 'Logs out the user and removes the refreshToken.'
  })
  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Valid refresh token for logout',
    examples: {
      'Successful logout': RefreshTokenRequestExample,
      'Token error': {
        summary: 'Invalid token',
        description: 'Example of refresh token error',
        value: {
          refreshToken: 'token-invalido'
        }
      }
    }
  })
  @LogoutResponse()
  @UnauthorizedErrorResponse()
  @RateLimitErrorResponse()
  @InternalServerErrorResponse()
  async logout(
    @CurrentUser() user: any,
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<void> {
    if (!user) throw new UnauthorizedException('Token de acceso requerido');
    return this.authService.logout(user.id, refreshTokenDto.refreshToken);
  }

  @Post('logout-all')
  @ApiOperation({
    summary: 'Logout all sessions',
    description: 'Logs out all active user sessions.'
  })
  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  @ApiBearerAuth()
  @LogoutAllResponse()
  @UnauthorizedErrorResponse()
  @RateLimitErrorResponse()
  @InternalServerErrorResponse()
  async logoutAll(@CurrentUser() user: any): Promise<void> {
    if (!user) throw new UnauthorizedException('Token de acceso requerido');
    return this.authService.logoutAll(user.id);
  }

  @Post('validate')
  @Public()
  @UseGuards(ThrottlerGuard)
  @ThrottleValidate()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate credentials',
    description: 'Validates if email/username and password credentials are correct.'
  })
  @ApiBody({
    type: LoginDto,
    description: 'Credentials to validate',
    examples: {
      'Validate credentials': ValidateCredentialsRequestExample,
      'Invalid credentials': {
        summary: 'Invalid credentials',
        description: 'Example of invalid credentials error',
        value: {
          emailOrUsername: 'usuario@ejemplo.com',
          password: 'incorrecta'
        }
      }
    }
  })
  @ValidateCredentialsResponse()
  @ValidationErrorResponse()
  @UnauthorizedErrorResponse()
  @RateLimitErrorResponse()
  @InternalServerErrorResponse()
  async validateUser(@Body() loginDto: LoginDto): Promise<{ isValid: boolean }> {
    const user = await this.authService.validateUser(loginDto.emailOrUsername, loginDto.password);
    return { isValid: !!user };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Returns the authenticated user profile information.'
  })
  @ProfileResponse()
  @UnauthorizedErrorResponse()
  @NotFoundErrorResponse()
  @InternalServerErrorResponse()
  async getProfile(@CurrentUser() user: any) {
    if (!user) throw new UnauthorizedException('Token de acceso requerido');
    return this.authService.getProfile(user.id);
  }
} 