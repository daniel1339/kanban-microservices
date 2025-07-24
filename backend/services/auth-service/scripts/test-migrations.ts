import { DataSource } from 'typeorm';
import ormconfig from '../ormconfig';

async function testMigrations() {
  const dataSource = ormconfig;

  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Check migration status
    console.log('\n📋 Checking migration status...');
    const migrations = await dataSource.showMigrations();
    console.log('Migrations status:', migrations);

    // Check existing tables
    console.log('\n📊 Checking existing tables...');
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('Existing tables:', tables.map((t: any) => t.table_name));

    // Check indexes
    console.log('\n🔍 Checking indexes...');
    const indexes = await dataSource.query(`
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `);
    console.log('Existing indexes:', indexes.map((i: any) => `${i.tablename}.${i.indexname}`));

    // Check constraints
    console.log('\n🔒 Checking constraints...');
    const constraints = await dataSource.query(`
      SELECT conname, contype, conrelid::regclass as table_name
      FROM pg_constraint 
      WHERE contype IN ('f', 'u', 'c')
      ORDER BY conrelid::regclass, conname
    `);
    console.log('Existing constraints:', constraints.map((c: any) => `${c.table_name}.${c.conname} (${c.contype})`));

    console.log('\n✅ Migration test completed successfully!');

  } catch (error) {
    console.error('❌ Migration test failed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

// Execute only if called directly
if (require.main === module) {
  testMigrations();
}

export { testMigrations }; 