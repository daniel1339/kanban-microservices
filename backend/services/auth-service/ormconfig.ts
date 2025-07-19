import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './src/auth/entities/user.entity';
import { RefreshToken } from './src/auth/entities/refresh-token.entity';

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'password'),
  database: configService.get('DB_NAME', 'auth_service'),
  entities: [User, RefreshToken],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false, // Deshabilitado para producción
  logging: configService.get('NODE_ENV') === 'development',
  ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
  extra: {
    connectionLimit: configService.get('DB_POOL_MAX', 10),
    acquireTimeout: configService.get('DB_ACQUIRE_TIMEOUT', 30000),
    timeout: configService.get('DB_TIMEOUT', 30000),
  },
}); 