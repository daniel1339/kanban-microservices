import { HealthCheckService } from './health-check.service';
import { ServiceDiscoveryService } from './service-discovery.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HealthCheckService', () => {
  let healthCheckService: HealthCheckService;
  let serviceDiscovery: ServiceDiscoveryService;

  beforeEach(() => {
    serviceDiscovery = new ServiceDiscoveryService();
    healthCheckService = new HealthCheckService(serviceDiscovery);
  });

  it('should return healthy for a healthy service', async () => {
    mockedAxios.get.mockResolvedValueOnce({ status: 200 });
    const service = serviceDiscovery.getServiceConfig('auth');
    const result = await healthCheckService.checkServiceHealth(service!);
    expect(result.status).toBe('healthy');
    expect(result.responseTime).toBeGreaterThanOrEqual(0);
  });

  it('should return unhealthy for a failing service', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Connection refused'));
    const service = serviceDiscovery.getServiceConfig('user');
    const result = await healthCheckService.checkServiceHealth(service!);
    expect(result.status).toBe('unhealthy');
    expect(result.error).toBe('Connection refused');
  });

  it('should check all services health', async () => {
    mockedAxios.get.mockResolvedValue({ status: 200 });
    const results = await healthCheckService.checkAllServicesHealth();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(1);
    expect(results[0]).toHaveProperty('status');
  });
}); 