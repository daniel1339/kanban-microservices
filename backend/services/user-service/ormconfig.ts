import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserProfile } from './src/database/entities/user-profile.entity';
import { UserActivity } from './src/database/entities/user-activity.entity';

const configService = new ConfigService();

const databaseUrl = process.env.DATABASE_URL;

export default new DataSource(
  databaseUrl
    ? {
        type: 'postgres',
        url: databaseUrl,
        entities: [UserProfile, UserActivity],
        migrations: ['src/database/migrations/*.ts'],
        synchronize: false,
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }
    : {
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'kanban_user'),
        password: configService.get('DB_PASSWORD', 'kanban_password'),
        database: configService.get('DB_NAME', 'kanban'),
        entities: [UserProfile, UserActivity],
        migrations: ['src/database/migrations/*.ts'],
        synchronize: false,
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }
); 