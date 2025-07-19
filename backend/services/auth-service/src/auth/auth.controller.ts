import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthResponse } from './interfaces/auth.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos o contraseñas no coinciden' 
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email o username ya existe' 
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso',
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas' 
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar token de acceso' })
  @ApiResponse({ 
    status: 200, 
    description: 'Token renovado exitosamente',
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Refresh token inválido o expirado' 
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ 
    status: 204, 
    description: 'Logout exitoso' 
  })
  @ApiBearerAuth()
  async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
    // TODO: Implementar JWT Guard para obtener userId del token
    // Por ahora, requerimos que el usuario envíe su userId
    // En una implementación real, esto vendría del JWT token
    const userId = 'temp-user-id'; // Esto se obtendría del JWT Guard
    await this.authService.logout(userId, refreshTokenDto.refreshToken);
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validar credenciales de usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Credenciales válidas' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas' 
  })
  async validateUser(@Body() loginDto: LoginDto): Promise<{ isValid: boolean }> {
    const user = await this.authService.validateUser(
      loginDto.emailOrUsername,
      loginDto.password,
    );
    return { isValid: !!user };
  }
} 