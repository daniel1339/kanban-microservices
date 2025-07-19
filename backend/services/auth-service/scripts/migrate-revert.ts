import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

async function revertMigrations() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🔄 Revirtiendo última migración...');
    await dataSource.undoLastMigration();
    console.log('✅ Migración revertida exitosamente');
  } catch (error) {
    console.error('❌ Error revirtiendo migración:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

revertMigrations(); 