import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User, RefreshToken } from './entities';
import { RegisterDto, LoginDto } from './dto';
import { AuthResponse, UserResponse, TokenPayload, RefreshTokenPayload, IAuthService } from './interfaces/auth.interface';
import { CacheService } from '../common/services/cache.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private eventEmitter: EventEmitter2,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, username, password, passwordConfirmation } = registerDto;

    // Validar que las contraseñas coincidan
    if (password !== passwordConfirmation) {
      throw new BadRequestException('Passwords do not match');
    }

    // Verificar si el email ya existe
    const existingEmail = await this.userRepository.findOne({ where: { email } });
    if (existingEmail) {
      throw new ConflictException('Email is already registered');
    }

    // Verificar si el username ya existe
    const existingUsername = await this.userRepository.findOne({ where: { username } });
    if (existingUsername) {
      throw new ConflictException('Username is already in use');
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

    // Emitir evento user.created
    this.eventEmitter.emit('user.created', {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      // agrega otros campos relevantes
    });

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
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
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
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        throw new UnauthorizedException('JWT secret not configured');
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
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Verificar que no haya expirado
      if (new Date() > tokenEntity.expires_at) {
        await this.refreshTokenRepository.remove(tokenEntity);
        throw new UnauthorizedException('Refresh token expired');
      }

      // TOKEN ROTATION: Invalidar el token actual antes de generar uno nuevo
      await this.refreshTokenRepository.remove(tokenEntity);

      // Generar nuevos tokens
      const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(tokenEntity.user);

      return {
        user: this.mapUserToResponse(tokenEntity.user),
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 15 * 60, // 15 minutos
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    try {
      // Verificar que el token pertenece al usuario
      const tokenEntity = await this.refreshTokenRepository.findOne({
        where: {
          user_id: userId,
          token: refreshToken,
        },
      });

      if (tokenEntity) {
        // Eliminar el refresh token específico
        await this.refreshTokenRepository.remove(tokenEntity);
      }
    } catch (error) {
      // Si hay error, intentar eliminar directamente
      await this.refreshTokenRepository.delete({
        user_id: userId,
        token: refreshToken,
      });
    }
  }

  async logoutAll(userId: string): Promise<void> {
    // Eliminar todos los refresh tokens del usuario
    await this.refreshTokenRepository.delete({ user_id: userId });
  }

  async validateUser(emailOrUsername: string, password: string): Promise<any> {
    // Intentar obtener del cache primero
    let user = await this.cacheService.getUserByEmail(emailOrUsername);
    
    if (!user) {
      user = await this.cacheService.getUserByUsername(emailOrUsername);
    }

    // Si no está en cache, buscar en BD
    if (!user) {
      user = await this.userRepository.findOne({
        where: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      });

      // Guardar en cache si se encontró
      if (user) {
        await this.cacheService.setUser(user);
      }
    }

    if (user && await bcrypt.compare(password, user.password_hash)) {
      const { password_hash, ...result } = user;
      return result;
    }

    return null;
  }

  async validateUserById(userId: string): Promise<any> {
    // Intentar obtener del cache primero
    let user = await this.cacheService.getUserById(userId);

    // Si no está en cache, buscar en BD
    if (!user) {
      user = await this.userRepository.findOne({
        where: { id: userId },
      });

      // Guardar en cache si se encontró
      if (user) {
        await this.cacheService.setUser(user);
      }
    }

    if (user) {
      const { password_hash, ...result } = user;
      return result;
    }

    return null;
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT secret not configured');
    }
    
    const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '15m');
    const jwtRefreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');

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
      expiresIn: jwtRefreshExpiresIn,
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

  async verifyToken(token: string): Promise<any> {
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        throw new UnauthorizedException('JWT secret not configured');
      }

      const payload = jwt.verify(token, jwtSecret) as any;
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async revokeToken(tokenId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ id: tokenId });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.delete({ user_id: userId });
  }

  async cleanupExpiredTokens(): Promise<number> {
    const expiredTokens = await this.refreshTokenRepository
      .createQueryBuilder('token')
      .where('token.expires_at < :now', { now: new Date() })
      .getMany();

    if (expiredTokens.length > 0) {
      await this.refreshTokenRepository.remove(expiredTokens);
    }

    return expiredTokens.length;
  }

  async getUserActiveTokens(userId: string): Promise<RefreshToken[]> {
    return this.refreshTokenRepository.find({
      where: {
        user_id: userId,
        expires_at: { $gt: new Date() } as any,
      },
      order: { created_at: 'DESC' },
    });
  }

  async revokeTokenByToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }

  async isTokenValid(tokenId: string, token: string): Promise<boolean> {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { id: tokenId },
    });

    if (!tokenEntity) {
      return false;
    }

    // Verificar que el token coincida y no haya expirado
    return tokenEntity.token === token && new Date() < tokenEntity.expires_at;
  }

  async getProfile(userId: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapUserToResponse(user);
  }

  async updateUser(userId: string, updateDto: Partial<{ email: string; username: string }>): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (updateDto.email) user.email = updateDto.email;
    if (updateDto.username) user.username = updateDto.username;
    const updatedUser = await this.userRepository.save(user);
    this.eventEmitter.emit('user.updated', {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
    });
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.userRepository.remove(user);
    this.eventEmitter.emit('user.deleted', { id: userId });
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