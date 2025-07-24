import { ProxyMiddleware } from './proxy.middleware';
import { RoutingService } from '../../gateway/services/routing.service';
import { LoadBalancerService } from '../../gateway/services/load-balancer.service';

// Simple mocks for required services
const next = jest.fn();
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const circuitBreakerService = {
  isOpen: jest.fn().mockReturnValue(false),
  recordFailure: jest.fn(),
  recordSuccess: jest.fn(),
} as any;

describe('ProxyMiddleware', () => {
  it('should call next() for non-api routes', () => {
    const routingService = { resolveServiceByPath: jest.fn() } as unknown as RoutingService;
    const loadBalancerService = { getServiceInstanceUrl: jest.fn() } as unknown as LoadBalancerService;
    const middleware = new ProxyMiddleware(routingService, loadBalancerService, circuitBreakerService);
    const req = { path: '/not-api/test' } as any;
    middleware.use(req, res as any, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 502 if no route found', () => {
    const routingService = { resolveServiceByPath: jest.fn().mockReturnValue(undefined) } as unknown as RoutingService;
    const loadBalancerService = { getServiceInstanceUrl: jest.fn() } as unknown as LoadBalancerService;
    const middleware = new ProxyMiddleware(routingService, loadBalancerService, circuitBreakerService);
    const req = { path: '/api/unknown' } as any;
    middleware.use(req, res as any, next);
    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Bad Gateway' }));
  });

  it('should return 503 if service unavailable', () => {
    const routingService = { resolveServiceByPath: jest.fn().mockReturnValue('auth') } as unknown as RoutingService;
    const loadBalancerService = { getServiceInstanceUrl: jest.fn().mockReturnValue(undefined), getInstances: jest.fn().mockReturnValue([]) } as unknown as LoadBalancerService;
    const middleware = new ProxyMiddleware(routingService, loadBalancerService, circuitBreakerService);
    const req = { path: '/api/auth/login' } as any;
    middleware.use(req, res as any, next);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Service Unavailable' }));
  });
}); 