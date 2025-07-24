import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, RequestHandler, Options } from 'http-proxy-middleware';
import { RoutingService } from '../../gateway/services/routing.service';
import { LoadBalancerService } from '../../gateway/services/load-balancer.service';
import { CircuitBreakerService } from '../services/circuit-breaker.service';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  constructor(
    private readonly routingService: RoutingService,
    private readonly loadBalancerService: LoadBalancerService,
    private readonly circuitBreakerService: CircuitBreakerService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Only proxy for /api/* routes
    if (!req.path.startsWith('/api/')) {
      return next();
    }
    // Determine the target service
    const serviceName = this.routingService.resolveServiceByPath(req.path);
    if (!serviceName) {
      return res.status(502).json({
        statusCode: 502,
        message: 'No route found for this path',
        error: 'Bad Gateway',
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
      });
    }
    // Advanced load balancer: round-robin and health check
    const instances = this.loadBalancerService.getInstances(serviceName);
    if (!instances || instances.length === 0) {
      return res.status(503).json({
        statusCode: 503,
        message: `No healthy instance available for service '${serviceName}'`,
        error: 'Service Unavailable',
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
      });
    }
    // Find the next healthy and closed-circuit instance
    let target: string | undefined;
    let selectedInstanceUrl: string | undefined;
    for (let i = 0; i < instances.length; i++) {
      const url = this.loadBalancerService.getServiceInstanceUrl(serviceName);
      if (!url) break;
      const isOpen = this.circuitBreakerService.isOpen(serviceName, url);
      if (!isOpen) {
        target = url;
        selectedInstanceUrl = url;
        break;
      }
    }
    if (!target) {
      return res.status(503).json({
        statusCode: 503,
        message: `All instances for service '${serviceName}' are unavailable (circuit open or unhealthy)`,
        error: 'Service Unavailable',
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
      });
    }
    // Create and execute the proxy
    return createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: (path: string) => path, // Do not rewrite the path
      onProxyReq: (proxyReq: any, req: Request, res: Response) => {
        // You can add custom headers here if needed
      },
      onError: (err: Error, req: Request, res: Response) => {
        // Record failure in circuit breaker
        if (selectedInstanceUrl) {
          this.circuitBreakerService.recordFailure(serviceName, selectedInstanceUrl);
        }
        res.status(500).json({
          statusCode: 500,
          message: err.message,
          error: 'Proxy Error',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        });
      },
      onProxyRes: (proxyRes: any, req: Request, res: Response) => {
        // Record success in circuit breaker
        if (selectedInstanceUrl) {
          this.circuitBreakerService.recordSuccess(serviceName, selectedInstanceUrl);
        }
      },
    } as Options)(req, res, next);
  }
} 