import { DataSource } from 'typeorm';
import { UserProfile } from './src/database/entities/user-profile.entity';
import { UserActivity } from './src/database/entities/user-activity.entity';

const databaseUrl = process.env.DATABASE_URL;
const nodeEnv = process.env.NODE_ENV || 'development';

export default new DataSource(
  databaseUrl
    ? {
        type: 'postgres',
        url: databaseUrl,
        entities: [UserProfile, UserActivity],
        migrations: ['src/database/migrations/*.ts'],
        synchronize: false,
        logging: nodeEnv === 'development',
        ssl: nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
      }
    : {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'kanban_user',
        password: process.env.DB_PASSWORD || 'kanban_password',
        database: process.env.DB_NAME || 'kanban',
        entities: [UserProfile, UserActivity],
        migrations: ['src/database/migrations/*.ts'],
        synchronize: false,
        logging: nodeEnv === 'development',
        ssl: nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
      }
); 