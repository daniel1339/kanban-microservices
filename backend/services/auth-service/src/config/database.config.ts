import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User, RefreshToken } from '../auth/entities';

// Function to manually parse DATABASE_URL
function parseDatabaseUrl(url: string) {
  try {
    const urlObj = new URL(url);
    return {
      host: urlObj.hostname,
      port: parseInt(urlObj.port, 10),
      username: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.slice(1), // Remove the initial '/'
    };
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL: ${error.message}`);
  }
}

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const nodeEnv = configService.get<string>('NODE_ENV');
  const isProduction = nodeEnv === 'production';
  const isTest = nodeEnv === 'test';
  
  // Base configuration
  const baseConfig = {
    type: 'postgres' as const,
    entities: [User, RefreshToken],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    migrationsRun: isProduction, // Run migrations only in production
    synchronize: !isProduction, // Only in development
    logging: !isProduction && !isTest, // Only in development, not in test or production
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };

  // Get DATABASE_URL (required)
  const databaseUrl = configService.get<string>('DATABASE_URL');
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required. Please set it in your environment variables.');
  }

  // Manually parse DATABASE_URL
  const parsed = parseDatabaseUrl(databaseUrl);
  
  return {
    ...baseConfig,
    host: parsed.host,
    port: parsed.port,
    username: parsed.username,
    password: parsed.password,
    database: parsed.database,
  };
};
 