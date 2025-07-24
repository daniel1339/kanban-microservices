import { Injectable } from '@nestjs/common';
import { ServiceDiscoveryService } from '../../common/services/service-discovery.service';

@Injectable()
export class RoutingService {
  constructor(private readonly serviceDiscovery: ServiceDiscoveryService) {}

  // Mapea rutas base a servicios
  private readonly routeMap: Record<string, string> = {
    '/api/auth': 'auth',
    '/api/users': 'user',
    '/api/projects': 'project',
    '/api/boards': 'board',
    '/api/cards': 'card',
    '/api/lists': 'list',
    '/api/notifications': 'notification',
    '/api/files': 'file',
  };

  resolveServiceByPath(path: string): string | undefined {
    // Busca la ruta base más larga que coincida
    const match = Object.keys(this.routeMap)
      .sort((a, b) => b.length - a.length)
      .find((base) => path.startsWith(base));
    if (match) {
      return this.routeMap[match];
    }
    return undefined;
  }

  resolveServiceUrl(path: string): string | undefined {
    const serviceName = this.resolveServiceByPath(path);
    if (!serviceName) return undefined;
    return this.serviceDiscovery.getServiceUrl(serviceName);
  }
} 