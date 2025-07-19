import { DataSource } from 'typeorm';
import { UserSeeder } from './user.seeder';
import ormconfig from '../../../ormconfig';

async function runSeeds() {
  const dataSource = ormconfig;

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    // Ejecutar seeders
    const userSeeder = new UserSeeder(dataSource);
    await userSeeder.run();

    console.log('All seeds completed successfully');
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

runSeeds(); 