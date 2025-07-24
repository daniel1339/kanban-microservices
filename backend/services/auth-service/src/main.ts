import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters';
import { ValidationPipe as CustomValidationPipe } from './common/pipes';
import { LoggingInterceptor, TransformInterceptor } from './common/interceptors';
import { SecurityInterceptor } from './common/interceptors/security.interceptor';
import { PerformanceInterceptor } from './common/interceptors/performance.interceptor';
import { CompressionInterceptor } from './common/interceptors/compression.interceptor';
import { SwaggerConfig } from './docs/swagger.config';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // LOG HERE
  

  // Security: Helmet.js for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false, // For Swagger
    crossOriginResourcePolicy: { policy: "cross-origin" }, // For Swagger
  }));

  // Configure CORS with enhanced security
  app.enableCors({
    origin: configService.get<string[]>('app.cors.origin'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  });

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global pipes
  app.useGlobalPipes(new CustomValidationPipe());

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new SecurityInterceptor(configService),
    new PerformanceInterceptor(configService),
    new CompressionInterceptor(configService),
  );

  // Global guards
  const jwtAuthGuard = app.get(JwtAuthGuard);
  app.useGlobalGuards(jwtAuthGuard);

  // Swagger documentation
  SwaggerConfig.setup(app);

  const port = configService.get<number>('app.port') || 3001;
  await app.listen(port);
  console.log(`🚀 Auth Service running on port ${port}`);
  console.log(`📚 Swagger documentation available at http://localhost:${port}/api/docs`);
}

void bootstrap();
