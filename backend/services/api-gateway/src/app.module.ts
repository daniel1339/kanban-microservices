  import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
  import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
  import { AppController } from './app.controller';
  import { AppService } from './app.service';
  import { RoutingService } from './gateway/services/routing.service';
  import { LoadBalancerService } from './gateway/services/load-balancer.service';
  import { ServiceDiscoveryService } from './common/services/service-discovery.service';
  import { ProxyMiddleware } from './common/middleware/proxy.middleware';
  import { HealthController } from './gateway/controllers/health.controller';
  import { AuthProxyController } from './gateway/controllers/auth-proxy.controller';
  import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
  import { RateLimitGuard } from './common/guards/rate-limit.guard';
  import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
  import { ThrottlerModule } from '@nestjs/throttler';
  import { JwtStrategy } from './common/strategies/jwt.strategy';
  import { CircuitBreakerService } from './common/services/circuit-breaker.service';

  @Module({
    imports: [
      ThrottlerModule.forRoot({
        throttlers: [
          {
            ttl: 60,
            limit: 20,
          },
        ],
      }),
    ],
    controllers: [AppController, HealthController, AuthProxyController],
    providers: [
      AppService,
      RoutingService,
      LoadBalancerService,
      ServiceDiscoveryService,
      ProxyMiddleware,
      CircuitBreakerService,
      JwtStrategy,
      {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
      },
      {
        provide: APP_GUARD,
        useClass: RateLimitGuard,
      },
      {
        provide: APP_INTERCEPTOR,
        useClass: LoggingInterceptor,
      },
    ],
  })
  export class AppModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(ProxyMiddleware)
        .forRoutes({ path: '/api/*', method: RequestMethod.ALL });
    }
  }
