import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ServiceDiscoveryService, ServiceConfig } from './service-discovery.service';

export interface ServiceHealth {
  name: string;
  url: string;
  status: 'healthy' | 'unhealthy';
  responseTime: number | null;
  error?: string;
}

@Injectable()
export class HealthCheckService {
  constructor(private readonly serviceDiscovery: ServiceDiscoveryService) {}

  async checkServiceHealth(service: ServiceConfig): Promise<ServiceHealth> {
    const url = service.url + service.healthCheck;
    const start = Date.now();
    try {
      await axios.get(url, { timeout: service.timeout });
      return {
        name: service.name,
        url: service.url,
        status: 'healthy',
        responseTime: Date.now() - start,
      };
    } catch (error) {
      return {
        name: service.name,
        url: service.url,
        status: 'unhealthy',
        responseTime: null,
        error: error.message,
      };
    }
  }

  async checkAllServicesHealth(): Promise<ServiceHealth[]> {
    const services = this.serviceDiscovery.listServices();
    return Promise.all(services.map((svc) => this.checkServiceHealth(svc)));
  }
} 