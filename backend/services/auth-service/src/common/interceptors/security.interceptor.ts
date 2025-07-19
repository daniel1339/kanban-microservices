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
export class SecurityInterceptor implements NestInterceptor {
  private readonly logger = new Logger(SecurityInterceptor.name);

  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'Unknown';
    const startTime = Date.now();

    // Log security-relevant information
    this.logSecurityEvent('request_started', {
      method,
      url,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Log successful requests for security monitoring
        if (this.shouldLogRequest(method, url, response.statusCode)) {
          this.logSecurityEvent('request_completed', {
            method,
            url,
            ip,
            userAgent,
            statusCode: response.statusCode,
            duration,
            timestamp: new Date().toISOString(),
          });
        }
      }),
      catchError((error) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Log security-relevant errors
        this.logSecurityEvent('request_failed', {
          method,
          url,
          ip,
          userAgent,
          statusCode: error.status || 500,
          error: error.message,
          duration,
          timestamp: new Date().toISOString(),
        });

        throw error;
      }),
    );
  }

  private shouldLogRequest(method: string, url: string, statusCode: number): boolean {
    const securityConfig = this.configService.get('security.logging');

    // Always log failed attempts
    if (statusCode >= 400) {
      return true;
    }

    // Log successful logins if configured
    if (securityConfig?.logSuccessfulLogins && url.includes('/auth/login') && statusCode === 200) {
      return true;
    }

    // Log sensitive operations
    const sensitiveEndpoints = [
      '/auth/register',
      '/auth/logout',
      '/auth/logout-all',
      '/auth/refresh',
    ];

    return sensitiveEndpoints.some(endpoint => url.includes(endpoint));
  }

  private logSecurityEvent(eventType: string, data: any): void {
    const securityConfig = this.configService.get('security.logging');

    // Mask sensitive data if configured
    if (securityConfig?.maskSensitiveData) {
      data = this.maskSensitiveData(data);
    }

    const logMessage = {
      event: eventType,
      ...data,
      service: 'auth-service',
      environment: this.configService.get('app.nodeEnv'),
    };

    // Use different log levels based on event type
    switch (eventType) {
      case 'request_failed':
        this.logger.warn('Security Event', logMessage);
        break;
      case 'request_completed':
        this.logger.log('Security Event', logMessage);
        break;
      default:
        this.logger.debug('Security Event', logMessage);
    }
  }

  private maskSensitiveData(data: any): any {
    const masked = { ...data };

    // Mask potential sensitive fields
    if (masked.password) {
      masked.password = '***MASKED***';
    }
    if (masked.email) {
      masked.email = this.maskEmail(masked.email);
    }
    if (masked.token) {
      masked.token = '***MASKED***';
    }
    if (masked.refreshToken) {
      masked.refreshToken = '***MASKED***';
    }

    return masked;
  }

  private maskEmail(email: string): string {
    if (!email || !email.includes('@')) {
      return email;
    }

    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.length > 2 
      ? localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1)
      : localPart;

    return `${maskedLocal}@${domain}`;
  }
} 