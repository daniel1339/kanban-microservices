import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configure CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API Gateway running on port ${port}`);
}
bootstrap();
