import { Injectable } from '@nestjs/common';

export interface ServiceConfig {
  name: string;
  url: string;
  healthCheck: string;
  timeout: number;
}

@Injectable()
export class ServiceDiscoveryService {
  private readonly services: Record<string, ServiceConfig> = {
    auth: {
      name: 'auth',
      url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
      healthCheck: '/api/health',
      timeout: 5000,
    },
    user: {
      name: 'user',
      url: process.env.USER_SERVICE_URL || 'http://localhost:3002',
      healthCheck: '/api/health',
      timeout: 5000,
    },
    project: {
      name: 'project',
      url: process.env.PROJECT_SERVICE_URL || 'http://localhost:3003',
      healthCheck: '/health',
      timeout: 5000,
    },
    board: {
      name: 'board',
      url: process.env.BOARD_SERVICE_URL || 'http://localhost:3004',
      healthCheck: '/health',
      timeout: 5000,
    },
    card: {
      name: 'card',
      url: process.env.CARD_SERVICE_URL || 'http://localhost:3005',
      healthCheck: '/health',
      timeout: 5000,
    },
    list: {
      name: 'list',
      url: process.env.LIST_SERVICE_URL || 'http://localhost:3006',
      healthCheck: '/health',
      timeout: 5000,
    },
    notification: {
      name: 'notification',
      url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3007',
      healthCheck: '/health',
      timeout: 5000,
    },
    file: {
      name: 'file',
      url: process.env.FILE_SERVICE_URL || 'http://localhost:3008',
      healthCheck: '/health',
      timeout: 5000,
    },
  };

  getServiceConfig(name: string): ServiceConfig | undefined {
    return this.services[name];
  }

  getServiceUrl(name: string): string | undefined {
    return this.services[name]?.url;
  }

  listServices(): ServiceConfig[] {
    return Object.values(this.services);
  }
} 