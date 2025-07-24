import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Aquí iría la lógica real de proxy (usando http-proxy-middleware o similar)
    // Por ahora solo llama a next()
    next();
  }
} 