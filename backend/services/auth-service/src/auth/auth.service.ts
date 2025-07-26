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

    // Validate that passwords match
    if (password !== passwordConfirmation) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if email already exists
    const existingEmail = await this.userRepository.findOne({ where: { email } });
    if (existingEmail) {
      throw new ConflictException('Email is already registered');
    }

    // Check if username already exists
    const existingUsername = await this.userRepository.findOne({ where: { username } });
    if (existingUsername) {
      throw new ConflictException('Username is already in use');
    }

    // Encrypt password
    const saltRounds = this.configService.get<number>('bcrypt.rounds', 12);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      email,
      username,
      password_hash: passwordHash,
      is_verified: false,
    });

    const savedUser = await this.userRepository.save(user);

    // Emit user.created event
    this.eventEmitter.emit('user.created', {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      // add other relevant fields
    });

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(savedUser);

    return {
      user: this.mapUserToResponse(savedUser),
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { emailOrUsername, password } = loginDto;

    // Find user by email or username
    const user = await this.userRepository.findOne({
      where: [
        { email: emailOrUsername },
        { username: emailOrUsername },
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      user: this.mapUserToResponse(user),
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Verify refresh token
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        throw new UnauthorizedException('JWT secret not configured');
      }

      const payload = jwt.verify(
        refreshToken,
        jwtSecret,
      ) as any as RefreshTokenPayload;

      // Find the refresh token in the database
      const tokenEntity = await this.refreshTokenRepository.findOne({
        where: { id: payload.tokenId },
        relations: ['user'],
      });

      if (!tokenEntity || tokenEntity.token !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if it has expired
      if (new Date() > tokenEntity.expires_at) {
        await this.refreshTokenRepository.remove(tokenEntity);
        throw new UnauthorizedException('Refresh token expired');
      }

      // TOKEN ROTATION: Invalidate current token before generating a new one
      await this.refreshTokenRepository.remove(tokenEntity);

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(tokenEntity.user);

      return {
        user: this.mapUserToResponse(tokenEntity.user),
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 15 * 60, // 15 minutes
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    try {
      // Verify that the token belongs to the user
      const tokenEntity = await this.refreshTokenRepository.findOne({
        where: {
          user_id: userId,
          token: refreshToken,
        },
      });

      if (tokenEntity) {
        // Remove the specific refresh token
        await this.refreshTokenRepository.remove(tokenEntity);
      }
    } catch (error) {
      // If there's an error, try to delete directly
      await this.refreshTokenRepository.delete({
        user_id: userId,
        token: refreshToken,
      });
    }
  }

  async logoutAll(userId: string): Promise<void> {
    // Remove all user refresh tokens
    await this.refreshTokenRepository.delete({ user_id: userId });
  }

  async validateUser(emailOrUsername: string, password: string): Promise<any> {
    // Try to get from cache first
    let user = await this.cacheService.getUserByEmail(emailOrUsername);
    
    if (!user) {
      user = await this.cacheService.getUserByUsername(emailOrUsername);
    }

    // If not in cache, search in database
    if (!user) {
      user = await this.userRepository.findOne({
        where: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      });

      // Save to cache if found
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
    // Try to get from cache first
    let user = await this.cacheService.getUserById(userId);

    // If not in cache, search in database
    if (!user) {
      user = await this.userRepository.findOne({
        where: { id: userId },
      });

      // Save to cache if found
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

    // Generate access token
    const accessTokenPayload: TokenPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = jwt.sign(accessTokenPayload, jwtSecret, {
      expiresIn: jwtExpiresIn,
    } as any);

    // Generate refresh token
    const refreshTokenId = uuidv4();
    const refreshTokenPayload: RefreshTokenPayload = {
      sub: user.id,
      tokenId: refreshTokenId,
    };

    const refreshToken = jwt.sign(refreshTokenPayload, jwtSecret, {
      expiresIn: jwtRefreshExpiresIn,
    } as any);

    // Save refresh token in database
    const refreshTokenEntity = this.refreshTokenRepository.create({
      id: refreshTokenId,
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
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

    // Verify that the token matches and hasn't expired
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