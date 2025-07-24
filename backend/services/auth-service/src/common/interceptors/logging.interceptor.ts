import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

export interface LoggedRequest {
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
}

export interface LoggedResponse {
  statusCode: number;
  responseTime: number;
  body?: any;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    // Generate unique ID for the request
    const requestId = this.generateRequestId();
    (request.headers as any)['x-request-id'] = requestId;

    // Log the request
    const loggedRequest: LoggedRequest = {
      method: request.method,
      url: request.url,
      ip: request.ip || request.connection.remoteAddress || 'unknown',
      userAgent: request.headers['user-agent'] || 'Unknown',
      body: this.sanitizeBody(request.body),
      params: request.params,
      query: request.query,
      headers: this.sanitizeHeaders(request.headers),
    };

    this.logger.log(
      `[${requestId}] ${request.method} ${request.url} - Request started`,
      loggedRequest,
    );

    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const loggedResponse: LoggedResponse = {
          statusCode: response.statusCode,
          responseTime,
          body: this.sanitizeResponse(data),
        };

        this.logger.log(
          `[${requestId}] ${request.method} ${request.url} - ${response.statusCode} (${responseTime}ms)`,
          loggedResponse,
        );
      }),
      catchError((error) => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        this.logger.error(
          `[${requestId}] ${request.method} ${request.url} - Error (${responseTime}ms)`,
          {
            error: error.message,
            stack: error.stack,
            responseTime,
          },
        );

        throw error;
      }),
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'passwordConfirmation', 'token', 'refreshToken'];
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private sanitizeHeaders(headers: any): any {
    if (!headers) return headers;

    const sanitized = { ...headers };
    
    // Remove sensitive headers
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private sanitizeResponse(data: any): any {
    if (!data) return data;

    // For authentication responses, remove tokens
    if (data.accessToken || data.refreshToken) {
      return {
        ...data,
        accessToken: data.accessToken ? '[REDACTED]' : undefined,
        refreshToken: data.refreshToken ? '[REDACTED]' : undefined,
      };
    }

    return data;
  }
} 