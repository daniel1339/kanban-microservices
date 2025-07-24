import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

export interface JwtPayload {
  sub: string; // userId
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret',
    });
  }

  async validate(payload: JwtPayload) {
    try {
      // Verificar que el usuario existe y está activo
      const user = await this.authService.validateUserById(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      if (user.isActive === false) {
        throw new UnauthorizedException('User account is deactivated');
      }

      // Si quieres requerir verificación, descomenta la siguiente línea:
      // if (!user.is_verified) {
      //   throw new UnauthorizedException('User not verified');
      // }

      // Retornar el usuario para que esté disponible en el request
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 