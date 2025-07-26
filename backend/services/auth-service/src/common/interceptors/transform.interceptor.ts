import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
  path: string;
  method: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const { url, method } = request;

    return next.handle().pipe(
      map((data) => ({
        data,
        message: this.getSuccessMessage(method, url),
        success: true,
        timestamp: new Date().toISOString(),
        path: url,
        method: method.toUpperCase(),
      })),
    );
  }

  private getSuccessMessage(method: string, url: string): string {
    const baseMessage = this.getBaseMessage(method);
    
    // Customize messages based on route
    if (url.includes('/auth/register')) {
      return 'User registered successfully';
    }
    if (url.includes('/auth/login')) {
      return 'Login successful';
    }
    if (url.includes('/auth/logout')) {
      return 'Session closed successfully';
    }
    if (url.includes('/auth/refresh')) {
      return 'Token renewed successfully';
    }
    if (url.includes('/auth/profile')) {
      return 'Profile retrieved successfully';
    }
    if (url.includes('/auth/validate')) {
      return 'Credentials validated successfully';
    }

    return baseMessage;
  }

  private getBaseMessage(method: string): string {
    switch (method.toLowerCase()) {
      case 'get':
        return 'Data retrieved successfully';
      case 'post':
        return 'Resource created successfully';
      case 'put':
      case 'patch':
        return 'Resource updated successfully';
      case 'delete':
        return 'Resource deleted successfully';
      default:
        return 'Operation completed successfully';
    }
  }
} 