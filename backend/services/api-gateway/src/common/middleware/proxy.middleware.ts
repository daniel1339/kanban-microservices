import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
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

  async use(req: Request, res: Response, next: NextFunction) {
    // Only proxy for /api/* routes
    if (!req.path.startsWith('/api/')) {
      return next();
    }

    // Skip /api/auth routes - let AuthProxyController handle them
    if (req.path.startsWith('/api/auth/')) {
      console.log(`🔍 ProxyMiddleware: Skipping /api/auth route - letting AuthProxyController handle: ${req.path}`);
      return next();
    }

    console.log(`🔍 ProxyMiddleware: Processing ${req.method} ${req.path}`);

    // Determine the target service
    const serviceName = this.routingService.resolveServiceByPath(req.path);
    console.log(`🔍 ProxyMiddleware: Resolved service: ${serviceName}`);

    if (!serviceName) {
      console.log(`❌ ProxyMiddleware: No service found for path: ${req.path}`);
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
    console.log(`🔍 ProxyMiddleware: Target URL: ${target}`);

    if (!target) {
      console.log(`❌ ProxyMiddleware: No target URL found for service: ${serviceName}`);
      return res.status(503).json({
        statusCode: 503,
        message: `No healthy instance available for service '${serviceName}'`,
        error: 'Service Unavailable',
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
      });
    }

    console.log(`🔍 ProxyMiddleware: TEMPORARILY DISABLED - Would proxy to ${target}`);
    
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