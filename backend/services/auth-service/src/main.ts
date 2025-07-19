import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configure CORS
  app.enableCors({
    origin: configService.get<string[]>('app.cors.origin'),
    credentials: true,
  });

  const port = configService.get<number>('app.port') || 3001;
  await app.listen(port);
  console.log(`🚀 Auth Service running on port ${port}`);
}

void bootstrap();
