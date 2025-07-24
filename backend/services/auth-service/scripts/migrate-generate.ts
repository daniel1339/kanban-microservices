import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

async function generateMigration() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  try {
    const migrationName = process.argv[2];
    if (!migrationName) {
      console.error('❌ You must provide a name for the migration');
      console.log('Usage: npm run migrate:generate <migration-name>');
      process.exit(1);
    }

    console.log(`🔄 Generating migration: ${migrationName}...`);
    // Note: To generate migrations, use TypeORM CLI
    // npm run typeorm migration:generate -- -n ${migrationName}
    console.log('⚠️  To generate migrations, use TypeORM CLI:');
    console.log(`   npm run typeorm migration:generate -- -n ${migrationName}`);
    console.log('✅ Instructions displayed');
  } catch (error) {
    console.error('❌ Error generating migration:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

generateMigration(); 