import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { User, RefreshToken } from './entities';
import { RegisterDto, LoginDto } from './dto';
import { AuthResponse, UserResponse, TokenPayload, RefreshTokenPayload, IAuthService } from './interfaces/auth.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, username, password, passwordConfirmation } = registerDto;

    // Validar que las contraseñas coincidan
    if (password !== passwordConfirmation) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Verificar si el email ya existe
    const existingEmail = await this.userRepository.findOne({ where: { email } });
    if (existingEmail) {
      throw new ConflictException('El email ya está registrado');
    }

    // Verificar si el username ya existe
    const existingUsername = await this.userRepository.findOne({ where: { username } });
    if (existingUsername) {
      throw new ConflictException('El username ya está en uso');
    }

    // Encriptar contraseña
    const saltRounds = this.configService.get<number>('bcrypt.rounds', 12);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const user = this.userRepository.create({
      email,
      username,
      password_hash: passwordHash,
      is_verified: false,
    });

    const savedUser = await this.userRepository.save(user);

    // Generar tokens
    const { accessToken, refreshToken } = await this.generateTokens(savedUser);

    return {
      user: this.mapUserToResponse(savedUser),
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutos
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { emailOrUsername, password } = loginDto;

    // Buscar usuario por email o username
    const user = await this.userRepository.findOne({
      where: [
        { email: emailOrUsername },
        { username: emailOrUsername },
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar tokens
    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      user: this.mapUserToResponse(user),
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutos
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Verificar refresh token
      const jwtSecret = this.configService.get<string>('jwt.secret');
      if (!jwtSecret) {
        throw new UnauthorizedException('JWT secret no configurado');
      }

      const payload = jwt.verify(
        refreshToken,
        jwtSecret,
      ) as any as RefreshTokenPayload;

      // Buscar el refresh token en la base de datos
      const tokenEntity = await this.refreshTokenRepository.findOne({
        where: { id: payload.tokenId },
        relations: ['user'],
      });

      if (!tokenEntity || tokenEntity.token !== refreshToken) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      // Verificar que no haya expirado
      if (new Date() > tokenEntity.expires_at) {
        await this.refreshTokenRepository.remove(tokenEntity);
        throw new UnauthorizedException('Refresh token expirado');
      }

      // Generar nuevos tokens
      const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(tokenEntity.user);

      return {
        user: this.mapUserToResponse(tokenEntity.user),
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 15 * 60, // 15 minutos
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    // Eliminar el refresh token de la base de datos
    await this.refreshTokenRepository.delete({
      user_id: userId,
      token: refreshToken,
    });
  }

  async validateUser(emailOrUsername: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: [
        { email: emailOrUsername },
        { username: emailOrUsername },
      ],
    });

    if (user && await bcrypt.compare(password, user.password_hash)) {
      const { password_hash, ...result } = user;
      return result;
    }

    return null;
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const jwtSecret = this.configService.get<string>('jwt.secret');
    if (!jwtSecret) {
      throw new Error('JWT secret no configurado');
    }
    
    const jwtExpiresIn = this.configService.get<string>('jwt.expiresIn', '15m');

    // Generar access token
    const accessTokenPayload: TokenPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = jwt.sign(accessTokenPayload, jwtSecret, {
      expiresIn: jwtExpiresIn,
    } as any);

    // Generar refresh token
    const refreshTokenId = uuidv4();
    const refreshTokenPayload: RefreshTokenPayload = {
      sub: user.id,
      tokenId: refreshTokenId,
    };

    const refreshToken = jwt.sign(refreshTokenPayload, jwtSecret, {
      expiresIn: this.configService.get<string>('jwt.refreshTokenExpiresIn', '7d'),
    } as any);

    // Guardar refresh token en la base de datos
    const refreshTokenEntity = this.refreshTokenRepository.create({
      id: refreshTokenId,
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return { accessToken, refreshToken };
  }

  private mapUserToResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      isVerified: user.is_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
} 