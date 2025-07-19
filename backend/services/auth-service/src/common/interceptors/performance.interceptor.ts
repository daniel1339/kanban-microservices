import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceInterceptor.name);
  private readonly metricsEnabled: boolean;
  private readonly slowQueryThreshold: number;

  constructor(private readonly configService: ConfigService) {
    this.metricsEnabled = this.configService.get('performance.monitoring.metrics.enabled', false);
    this.slowQueryThreshold = this.configService.get('performance.database.query.slowQueryThreshold', 1000);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url } = request;
    const startTime = process.hrtime.bigint();

    // Agregar headers de performance
    response.setHeader('X-Response-Time', '0ms');
    response.setHeader('X-Request-ID', this.generateRequestId());

    return next.handle().pipe(
      tap((data) => {
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - startTime) / 1000000; // Convertir a milisegundos

        // Actualizar header de tiempo de respuesta
        response.setHeader('X-Response-Time', `${duration.toFixed(2)}ms`);

        // Log de performance si está habilitado
        if (this.metricsEnabled) {
          this.logPerformanceMetrics(method, url, duration, response.statusCode, 'success');
        }

        // Log de queries lentos
        if (duration > this.slowQueryThreshold) {
          this.logger.warn(`Slow request detected: ${method} ${url} took ${duration.toFixed(2)}ms`);
        }
      }),
      catchError((error) => {
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - startTime) / 1000000;

        // Log de errores de performance
        if (this.metricsEnabled) {
          this.logPerformanceMetrics(method, url, duration, error.status || 500, 'error');
        }

        this.logger.error(`Request failed: ${method} ${url} took ${duration.toFixed(2)}ms`, error);
        throw error;
      }),
    );
  }

  private logPerformanceMetrics(
    method: string,
    url: string,
    duration: number,
    statusCode: number,
    status: 'success' | 'error',
  ): void {
    const metrics = {
      timestamp: new Date().toISOString(),
      method,
      url,
      duration: duration.toFixed(2),
      statusCode,
      status,
      service: 'auth-service',
      environment: this.configService.get('app.nodeEnv'),
    };

    // Log con nivel apropiado
    if (status === 'error') {
      this.logger.error('Performance Metrics', metrics);
    } else if (duration > 1000) {
      this.logger.warn('Performance Metrics', metrics);
    } else {
      this.logger.debug('Performance Metrics', metrics);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 