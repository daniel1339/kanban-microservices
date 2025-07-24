import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';

@Injectable()
export class CompressionInterceptor implements NestInterceptor {
  private compressionMiddleware: any;

  constructor(private readonly configService: ConfigService) {
    const compressionConfig = this.configService.get('performance.compression');
    
    this.compressionMiddleware = compression({
      level: compressionConfig?.level || 6,
      threshold: compressionConfig?.threshold || 1024,
      filter: compressionConfig?.filter || this.defaultFilter,
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    // Apply compression if enabled
    const compressionEnabled = this.configService.get('performance.compression.enabled', false);
    
    if (compressionEnabled) {
      return new Observable(observer => {
        this.compressionMiddleware(request, response, (err: any) => {
          if (err) {
            observer.error(err);
            return;
          }

          next.handle().pipe(
            map(data => {
              // Add compression headers if necessary
              if (!response.getHeader('Content-Encoding')) {
                response.setHeader('Vary', 'Accept-Encoding');
              }
              return data;
            })
          ).subscribe({
            next: (data) => observer.next(data),
            error: (error) => observer.error(error),
            complete: () => observer.complete(),
          });
        });
      });
    }

    return next.handle();
  }

  private defaultFilter(req: any, res: any): boolean {
    // Don't compress small requests
    if (req.headers['content-length'] && parseInt(req.headers['content-length']) < 1024) {
      return false;
    }

    // Don't compress if already compressed
    if (req.headers['content-encoding']) {
      return false;
    }

    // Compress only JSON and text responses
    const contentType = res.getHeader('Content-Type');
    if (contentType) {
      return contentType.includes('application/json') || 
             contentType.includes('text/') ||
             contentType.includes('application/xml');
    }

    return true;
  }
} 