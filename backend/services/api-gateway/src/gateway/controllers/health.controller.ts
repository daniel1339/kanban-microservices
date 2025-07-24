import { Controller, Get } from '@nestjs/common';
import { ServiceDiscoveryService } from '../../common/services/service-discovery.service';

@Controller('health')
export class HealthController {
  constructor(private readonly serviceDiscovery: ServiceDiscoveryService) {}

  /**
   * Gateway health check
   */
  @Get()
  getGatewayHealth() {
    return {
      status: 'ok',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Health of all registered microservices
   */
  @Get('services')
  getServicesHealth() {
    // Simulate health check (in the future, perform real fetch to /health of each service)
    const services = this.serviceDiscovery.listServices();
    return {
      status: 'ok',
      services: services.map((svc) => ({
        name: svc.name,
        url: svc.url,
        healthCheck: svc.healthCheck,
        status: 'unknown', // TODO: Real health check
      })),
      timestamp: new Date().toISOString(),
    };
  }
} 