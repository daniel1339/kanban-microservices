import { LoadBalancerService } from './load-balancer.service';
import { ServiceDiscoveryService } from '../../common/services/service-discovery.service';

describe('LoadBalancerService (advanced)', () => {
  let loadBalancer: LoadBalancerService;
  let serviceDiscovery: ServiceDiscoveryService;

  beforeEach(() => {
    serviceDiscovery = {
      listServices: jest.fn().mockReturnValue([
        { name: 'auth', url: 'http://localhost:3001', healthCheck: '/health', timeout: 5000 },
        { name: 'user', url: 'http://localhost:3002', healthCheck: '/health', timeout: 5000 },
      ]),
      getServiceUrl: jest.fn(),
      getServiceConfig: jest.fn(),
    } as any;
    loadBalancer = new LoadBalancerService(serviceDiscovery);
  });

  it('should return the only instance for a service', () => {
    expect(loadBalancer.getServiceInstanceUrl('auth')).toBe('http://localhost:3001');
  });

  it('should use round-robin for multiple healthy instances', () => {
    loadBalancer.addInstance('auth', 'http://localhost:3001-2');
    const urls = [
      loadBalancer.getServiceInstanceUrl('auth'),
      loadBalancer.getServiceInstanceUrl('auth'),
      loadBalancer.getServiceInstanceUrl('auth'),
    ];
    expect(urls).toEqual([
      'http://localhost:3001',
      'http://localhost:3001-2',
      'http://localhost:3001',
    ]);
  });

  it('should skip unhealthy instances', () => {
    loadBalancer.addInstance('auth', 'http://localhost:3001-2');
    loadBalancer.markUnhealthy('auth', 'http://localhost:3001');
    expect(loadBalancer.getServiceInstanceUrl('auth')).toBe('http://localhost:3001-2');
    loadBalancer.markUnhealthy('auth', 'http://localhost:3001-2');
    expect(loadBalancer.getServiceInstanceUrl('auth')).toBeUndefined();
    loadBalancer.markHealthy('auth', 'http://localhost:3001');
    expect(loadBalancer.getServiceInstanceUrl('auth')).toBe('http://localhost:3001');
  });

  it('should return undefined for unknown service', () => {
    expect(loadBalancer.getServiceInstanceUrl('unknown')).toBeUndefined();
  });
}); 