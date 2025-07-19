import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

async function generateMigration() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  try {
    const migrationName = process.argv[2];
    if (!migrationName) {
      console.error('❌ Debes proporcionar un nombre para la migración');
      console.log('Uso: npm run migrate:generate <nombre-migracion>');
      process.exit(1);
    }

    console.log(`🔄 Generando migración: ${migrationName}...`);
    // Nota: Para generar migraciones, usar el CLI de TypeORM
    // npm run typeorm migration:generate -- -n ${migrationName}
    console.log('⚠️  Para generar migraciones, usa el CLI de TypeORM:');
    console.log(`   npm run typeorm migration:generate -- -n ${migrationName}`);
    console.log('✅ Instrucciones mostradas');
  } catch (error) {
    console.error('❌ Error generando migración:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

generateMigration(); 