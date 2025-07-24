import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

async function revertMigrations() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🔄 Reverting last migration...');
    await dataSource.undoLastMigration();
    console.log('✅ Migration reverted successfully');
  } catch (error) {
    console.error('❌ Error reverting migration:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

revertMigrations(); 