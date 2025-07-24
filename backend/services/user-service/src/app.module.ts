import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventsListener } from './user/listeners/user-events.listener';

import { UserProfile } from './database/entities/user-profile.entity';
import { UserActivity } from './database/entities/user-activity.entity';

import { ProfileController } from './user/controllers/profile.controller';
import { UserController } from './user/controllers/user.controller';
import { AvatarController } from './user/controllers/avatar.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/services/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([UserProfile, UserActivity]),
    PassportModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController, ProfileController, UserController, AvatarController],
  providers: [JwtStrategy, UserEventsListener, AppService, UserService],
})
export class AppModule {}
