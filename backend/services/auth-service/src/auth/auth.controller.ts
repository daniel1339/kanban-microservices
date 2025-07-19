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

import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthResponse } from './interfaces/auth.interface';
import { Public } from '../common/decorators';
import { CurrentUser, UserPayload } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('auth')
@Controller('auth')
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos o contraseñas no coinciden',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email o username ya existe',
    type: ErrorResponseDto
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso',
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas',
    type: ErrorResponseDto
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar token de acceso' })
  @ApiResponse({ 
    status: 200, 
    description: 'Token renovado exitosamente',
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Refresh token inválido o expirado',
    type: ErrorResponseDto
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ 
    status: 204, 
    description: 'Logout exitoso' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token inválido',
    type: ErrorResponseDto
  })
  @ApiBearerAuth()
  async logout(
    @CurrentUser() user: UserPayload,
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<void> {
    await this.authService.logout(user.sub, refreshTokenDto.refreshToken);
  }

  @Post('validate')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validar credenciales de usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Credenciales válidas' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas',
    type: ErrorResponseDto
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
  @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil del usuario obtenido exitosamente' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token inválido',
    type: ErrorResponseDto
  })
  @ApiBearerAuth()
  async getProfile(@CurrentUser() user: UserPayload) {
    return this.authService.getProfile(user.sub);
  }
} 