import { Injectable } from '@nestjs/common';
import { ServiceDiscoveryService } from '../../common/services/service-discovery.service';

@Injectable()
export class LoadBalancerService {
  constructor(private readonly serviceDiscovery: ServiceDiscoveryService) {}

  // En el futuro, aquí se podría balancear entre varias instancias
  getServiceInstanceUrl(serviceName: string): string | undefined {
    return this.serviceDiscovery.getServiceUrl(serviceName);
  }
} 