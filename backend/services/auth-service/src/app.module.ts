import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import appConfig from './config/app.config';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isTest = process.env.NODE_ENV === 'test';
        const ttl = isTest ? 1 : configService.get('THROTTLE_TTL', 60);
        const limit = isTest ? 10000 : configService.get('THROTTLE_LIMIT', 10);
        return {
          ttl,
          limit,
          ignoreUserAgents: [
            /health-check/i,
          ],
          throttlers: [
            {
              name: 'short',
              ttl: isTest ? 1 : 1000,
              limit: isTest ? 10000 : 3,
            },
            {
              name: 'medium',
              ttl: isTest ? 1 : 10000,
              limit: isTest ? 10000 : 20,
            },
            {
              name: 'long',
              ttl: isTest ? 1 : 60000,
              limit: isTest ? 10000 : 100,
            },
          ],
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 300, // 5 minutes default
      max: 100, // maximum 100 items in cache
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
