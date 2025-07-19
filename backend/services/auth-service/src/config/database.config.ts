import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User, RefreshToken } from '../auth/entities';

// Función para parsear DATABASE_URL manualmente
function parseDatabaseUrl(url: string) {
  try {
    const urlObj = new URL(url);
    return {
      host: urlObj.hostname,
      port: parseInt(urlObj.port, 10),
      username: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.slice(1), // Remover el '/' inicial
    };
  } catch (error) {
    throw new Error(`Invalid DATABASE_URL: ${error.message}`);
  }
}

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  
  // Configuración base
  const baseConfig = {
    type: 'postgres' as const,
    entities: [User, RefreshToken],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    migrationsRun: isProduction, // Ejecutar migraciones solo en producción
    synchronize: !isProduction, // Solo en desarrollo
    logging: !isProduction,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };

  // Obtener DATABASE_URL (obligatorio)
  const databaseUrl = configService.get<string>('DATABASE_URL');
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required. Please set it in your environment variables.');
  }

  // Parsear DATABASE_URL manualmente
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
 