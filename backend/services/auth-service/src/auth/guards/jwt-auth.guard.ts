import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { lastValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const result = super.canActivate(context);
    let resolved: boolean;
    if (typeof result === 'boolean') {
      resolved = result;
    } else if (result instanceof Promise) {
      resolved = await result;
    } else {
      resolved = await lastValueFrom(result);
    }
    return resolved;
  }

  handleRequest(err: any, user: any, info: any, context?: ExecutionContext) {
    let tokenPresent = false;
    if (context) {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers['authorization'];
      tokenPresent = !!(authHeader && authHeader.startsWith('Bearer '));
    }

    if (err || !user) {
      // If there's a token but no user, assume invalid token
      if (tokenPresent) {
        throw new UnauthorizedException('Invalid token');
      }
      throw err || new UnauthorizedException('Access token required');
    }
    return user;
  }
} 