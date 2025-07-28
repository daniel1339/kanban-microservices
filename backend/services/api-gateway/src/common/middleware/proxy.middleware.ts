import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RoutingService } from '../../gateway/services/routing.service';
import { LoadBalancerService } from '../../gateway/services/load-balancer.service';
import { CircuitBreakerService } from '../services/circuit-breaker.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ProxyMiddleware.name);

  constructor(
    private readonly routingService: RoutingService,
    private readonly loadBalancerService: LoadBalancerService,
    private readonly circuitBreakerService: CircuitBreakerService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Only proxy for /api/* routes
    if (!req.path.startsWith('/api/')) {
      return next();
    }

    // Skip /api/auth routes - let AuthProxyController handle them
    if (req.path.startsWith('/api/auth/')) {
      this.logger.log(`Skipping /api/auth route - letting AuthProxyController handle: ${req.path}`);
      return next();
    }

    // Skip /api/users routes - let UserProxyController handle them
    if (req.path.startsWith('/api/users/')) {
      this.logger.log(`Skipping /api/users route - letting UserProxyController handle: ${req.path}`);
      return next();
    }

    // Determine the target service
    const serviceName = this.routingService.resolveServiceByPath(req.path);

    if (!serviceName) {
      this.logger.warn(`No service found for path: ${req.path}`);
      return res.status(502).json({
        statusCode: 502,
        message: 'No route found for this path',
        error: 'Bad Gateway',
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
      });
    }

    // Get service URL directly from load balancer
    const target = this.loadBalancerService.getServiceInstanceUrl(serviceName);

    if (!target) {
      this.logger.error(`No target URL found for service: ${serviceName}`);
      return res.status(503).json({
        statusCode: 503,
        message: `No healthy instance available for service '${serviceName}'`,
        error: 'Service Unavailable',
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
      });
    }

    // TEMPORARILY DISABLED - Just pass through
    return res.status(501).json({
      statusCode: 501,
      message: 'Proxy temporarily disabled for debugging',
      error: 'Not Implemented',
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      target: target,
    });
  }
} 