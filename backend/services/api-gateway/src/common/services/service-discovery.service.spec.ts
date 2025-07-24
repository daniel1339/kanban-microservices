import { ServiceDiscoveryService } from './service-discovery.service';

describe('ServiceDiscoveryService', () => {
  let service: ServiceDiscoveryService;

  beforeEach(() => {
    service = new ServiceDiscoveryService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return service config for auth', () => {
    const config = service.getServiceConfig('auth');
    expect(config).toBeDefined();
    expect(config?.url).toContain('localhost');
  });

  it('should return service url for user', () => {
    const url = service.getServiceUrl('user');
    expect(url).toContain('localhost');
  });

  it('should list all services', () => {
    const services = service.listServices();
    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(1);
  });
}); 