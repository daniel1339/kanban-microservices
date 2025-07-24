import { HealthController } from './health.controller';
import { ServiceDiscoveryService } from '../../common/services/service-discovery.service';

describe('HealthController', () => {
  let controller: HealthController;
  let serviceDiscovery: ServiceDiscoveryService;

  beforeEach(() => {
    serviceDiscovery = {
      listServices: jest.fn().mockReturnValue([
        { name: 'auth', url: 'http://localhost:3001', healthCheck: '/health' },
        { name: 'user', url: 'http://localhost:3002', healthCheck: '/health' },
      ]),
    } as any;
    controller = new HealthController(serviceDiscovery);
  });

  it('should return gateway health', () => {
    const result = controller.getGatewayHealth();
    expect(result).toHaveProperty('status', 'ok');
    expect(result).toHaveProperty('service', 'api-gateway');
    expect(result).toHaveProperty('timestamp');
  });

  it('should return services health', () => {
    const result = controller.getServicesHealth();
    expect(result).toHaveProperty('status', 'ok');
    expect(Array.isArray(result.services)).toBe(true);
    expect(result.services.length).toBeGreaterThan(0);
    expect(result).toHaveProperty('timestamp');
  });
}); 