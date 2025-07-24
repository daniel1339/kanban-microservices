import { LoadBalancerService } from './load-balancer.service';
import { ServiceDiscoveryService } from '../../common/services/service-discovery.service';

describe('LoadBalancerService', () => {
  let loadBalancer: LoadBalancerService;
  let serviceDiscovery: ServiceDiscoveryService;

  beforeEach(() => {
    serviceDiscovery = new ServiceDiscoveryService();
    loadBalancer = new LoadBalancerService(serviceDiscovery);
  });

  it('should return service instance url', () => {
    expect(loadBalancer.getServiceInstanceUrl('auth')).toContain('localhost');
    expect(loadBalancer.getServiceInstanceUrl('user')).toContain('localhost');
    expect(loadBalancer.getServiceInstanceUrl('unknown')).toBeUndefined();
  });
}); 