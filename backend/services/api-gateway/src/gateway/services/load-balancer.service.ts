import { Injectable } from '@nestjs/common';
import { ServiceDiscoveryService } from '../../common/services/service-discovery.service';

interface ServiceInstance {
  url: string;
  healthy: boolean;
}

@Injectable()
export class LoadBalancerService {
  private readonly roundRobinIndex: Record<string, number> = {};
  // Simulated service registry: in real scenarios, this could be dynamic or from service discovery
  private readonly serviceInstances: Record<string, ServiceInstance[]> = {};

  constructor(private readonly serviceDiscovery: ServiceDiscoveryService) {
    // Initialize with one instance per service (from ServiceDiscoveryService)
    for (const svc of this.serviceDiscovery.listServices()) {
      this.serviceInstances[svc.name] = [
        { url: svc.url, healthy: true },
      ];
      this.roundRobinIndex[svc.name] = 0;
    }
  }

  // Mark an instance as unhealthy (could be called by health check logic)
  markUnhealthy(serviceName: string, url: string) {
    const instances = this.serviceInstances[serviceName];
    if (!instances) return;
    const instance = instances.find((i) => i.url === url);
    if (instance) instance.healthy = false;
  }

  // Mark an instance as healthy
  markHealthy(serviceName: string, url: string) {
    const instances = this.serviceInstances[serviceName];
    if (!instances) return;
    const instance = instances.find((i) => i.url === url);
    if (instance) instance.healthy = true;
  }

  // Get the next healthy instance using round-robin
  getServiceInstanceUrl(serviceName: string): string | undefined {
    const instances = this.serviceInstances[serviceName];
    if (!instances || instances.length === 0) return undefined;
    const healthyInstances = instances.filter((i) => i.healthy);
    if (healthyInstances.length === 0) return undefined;
    // Round-robin selection
    const idx = this.roundRobinIndex[serviceName] % healthyInstances.length;
    this.roundRobinIndex[serviceName] = (this.roundRobinIndex[serviceName] + 1) % healthyInstances.length;
    return healthyInstances[idx].url;
  }

  // For testing/demo: add a new instance to a service
  addInstance(serviceName: string, url: string) {
    if (!this.serviceInstances[serviceName]) {
      this.serviceInstances[serviceName] = [];
      this.roundRobinIndex[serviceName] = 0;
    }
    this.serviceInstances[serviceName].push({ url, healthy: true });
  }

  // For testing/demo: get all instances
  getInstances(serviceName: string): ServiceInstance[] {
    return this.serviceInstances[serviceName] || [];
  }
} 