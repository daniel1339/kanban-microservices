import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

async function runMigrations() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🔄 Ejecutando migraciones...');
    await dataSource.runMigrations();
    console.log('✅ Migraciones ejecutadas exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runMigrations(); 