import { RoutingService } from './routing.service';
import { ServiceDiscoveryService } from '../../common/services/service-discovery.service';

describe('RoutingService', () => {
  let routingService: RoutingService;
  let serviceDiscovery: ServiceDiscoveryService;

  beforeEach(() => {
    serviceDiscovery = new ServiceDiscoveryService();
    routingService = new RoutingService(serviceDiscovery);
  });

  it('should resolve service name by path', () => {
    expect(routingService.resolveServiceByPath('/api/auth/login')).toBe('auth');
    expect(routingService.resolveServiceByPath('/api/users/profile')).toBe('user');
    expect(routingService.resolveServiceByPath('/api/projects/123')).toBe('project');
    expect(routingService.resolveServiceByPath('/api/unknown')).toBeUndefined();
  });

  it('should resolve service url by path', () => {
    expect(routingService.resolveServiceUrl('/api/auth/login')).toContain('localhost');
    expect(routingService.resolveServiceUrl('/api/users/profile')).toContain('localhost');
    expect(routingService.resolveServiceUrl('/api/unknown')).toBeUndefined();
  });
}); 