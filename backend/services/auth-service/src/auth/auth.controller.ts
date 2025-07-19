import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
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
  AuthResponseExample,
  UserProfileResponseExample,
  ValidateCredentialsResponseExample,
  ValidationErrorExample,
  UnauthorizedErrorExample,
  ConflictErrorExample,
  InvalidTokenErrorExample,
  RateLimitErrorExample
} from '../docs/examples/auth.examples';

import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthResponse } from './interfaces/auth.interface';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

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
    summary: 'Registrar un nuevo usuario',
    description: 'Crea una nueva cuenta de usuario con email, username y contraseña. La contraseña debe cumplir con los requisitos de seguridad.',
    tags: ['auth']
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Datos del usuario a registrar',
    examples: {
      'Registro exitoso': RegisterRequestExample,
      'Datos inválidos': {
        summary: 'Datos inválidos',
        description: 'Ejemplo con datos que no cumplen validaciones',
        value: {
          email: 'email-invalido',
          username: 'us',
          password: '123',
          confirmPassword: '456'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto,
    content: {
      'application/json': {
        example: AuthResponseExample
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos o contraseñas no coinciden',
    content: {
      'application/json': {
        example: ValidationErrorExample
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email o username ya existe',
    content: {
      'application/json': {
        example: ConflictErrorExample
      }
    }
  })
  @ApiResponse({ 
    status: 429, 
    description: 'Rate limit excedido',
    content: {
      'application/json': {
        example: RateLimitErrorExample
      }
    }
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ThrottleLogin()
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario usando email/username y contraseña. Retorna tokens de acceso y refresh.',
    tags: ['auth']
  })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciales de login',
    examples: {
      'Login con email': LoginRequestExample,
      'Login con username': LoginUsernameRequestExample,
      'Credenciales inválidas': {
        summary: 'Credenciales inválidas',
        description: 'Ejemplo con credenciales incorrectas',
        value: {
          emailOrUsername: 'usuario@ejemplo.com',
          password: 'password-incorrecto'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso',
    type: AuthResponseDto,
    content: {
      'application/json': {
        example: AuthResponseExample
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas',
    content: {
      'application/json': {
        example: UnauthorizedErrorExample
      }
    }
  })
  @ApiResponse({ 
    status: 429, 
    description: 'Rate limit excedido',
    content: {
      'application/json': {
        example: RateLimitErrorExample
      }
    }
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ThrottleRefresh()
  @ApiOperation({ 
    summary: 'Renovar token de acceso',
    description: 'Renueva el token de acceso usando un refresh token válido.',
    tags: ['auth']
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Refresh token para renovar acceso',
    examples: {
      'Refresh token válido': RefreshTokenRequestExample,
      'Refresh token inválido': {
        summary: 'Refresh token inválido',
        description: 'Ejemplo con refresh token expirado o inválido',
        value: {
          refreshToken: 'token-invalido-o-expirado'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token renovado exitosamente',
    type: AuthResponseDto,
    content: {
      'application/json': {
        example: AuthResponseExample
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Refresh token inválido o expirado',
    content: {
      'application/json': {
        example: InvalidTokenErrorExample
      }
    }
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Cerrar sesión',
    description: 'Invalida el refresh token y cierra la sesión del usuario.',
    tags: ['auth']
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Logout exitoso' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token inválido',
    content: {
      'application/json': {
        example: InvalidTokenErrorExample
      }
    }
  })
  @ApiBearerAuth('JWT-auth')
  async logout(
    @CurrentUser() user: CurrentUser,
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<void> {
    await this.authService.logout(user.id, refreshTokenDto.refreshToken);
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Cerrar todas las sesiones',
    description: 'Invalida todos los refresh tokens del usuario, cerrando todas las sesiones activas.',
    tags: ['auth']
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Todas las sesiones cerradas exitosamente' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token inválido',
    content: {
      'application/json': {
        example: InvalidTokenErrorExample
      }
    }
  })
  @ApiBearerAuth('JWT-auth')
  async logoutAll(@CurrentUser() user: CurrentUser): Promise<void> {
    await this.authService.logoutAll(user.id);
  }

  @Post('validate')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ThrottleValidate()
  @ApiOperation({ 
    summary: 'Validar credenciales de usuario',
    description: 'Valida las credenciales de un usuario sin realizar login. Útil para verificar contraseñas.',
    tags: ['auth']
  })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciales a validar',
    examples: {
      'Credenciales válidas': ValidateCredentialsRequestExample,
      'Credenciales inválidas': {
        summary: 'Credenciales inválidas',
        description: 'Ejemplo con credenciales incorrectas',
        value: {
          emailOrUsername: 'usuario@ejemplo.com',
          password: 'password-incorrecto'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Credenciales válidas',
    content: {
      'application/json': {
        example: ValidateCredentialsResponseExample
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas',
    content: {
      'application/json': {
        example: UnauthorizedErrorExample
      }
    }
  })
  async validateUser(@Body() loginDto: LoginDto): Promise<{ isValid: boolean }> {
    const user = await this.authService.validateUser(
      loginDto.emailOrUsername,
      loginDto.password,
    );
    return { isValid: !!user };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Obtener perfil del usuario actual',
    description: 'Retorna los datos del perfil del usuario autenticado.',
    tags: ['users']
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil del usuario obtenido exitosamente',
    content: {
      'application/json': {
        example: UserProfileResponseExample
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token inválido',
    content: {
      'application/json': {
        example: InvalidTokenErrorExample
      }
    }
  })
  @ApiBearerAuth('JWT-auth')
  async getProfile(@CurrentUser() user: CurrentUser) {
    return this.authService.getProfile(user.id);
  }
} 