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
    
    // Personalizar mensajes según la ruta
    if (url.includes('/auth/register')) {
      return 'Usuario registrado exitosamente';
    }
    if (url.includes('/auth/login')) {
      return 'Inicio de sesión exitoso';
    }
    if (url.includes('/auth/logout')) {
      return 'Sesión cerrada exitosamente';
    }
    if (url.includes('/auth/refresh')) {
      return 'Token renovado exitosamente';
    }
    if (url.includes('/auth/profile')) {
      return 'Perfil obtenido exitosamente';
    }
    if (url.includes('/auth/validate')) {
      return 'Credenciales validadas exitosamente';
    }

    return baseMessage;
  }

  private getBaseMessage(method: string): string {
    switch (method.toLowerCase()) {
      case 'get':
        return 'Datos obtenidos exitosamente';
      case 'post':
        return 'Recurso creado exitosamente';
      case 'put':
      case 'patch':
        return 'Recurso actualizado exitosamente';
      case 'delete':
        return 'Recurso eliminado exitosamente';
      default:
        return 'Operación completada exitosamente';
    }
  }
} 