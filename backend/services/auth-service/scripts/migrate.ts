import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

async function runMigrations() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🔄 Running migrations...');
    await dataSource.runMigrations();
    console.log('✅ Migrations executed successfully');
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

runMigrations(); 