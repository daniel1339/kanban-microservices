import { Client } from 'pg';

async function setupTestDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'kanban_user',
    password: 'kanban_password',
    database: 'postgres', // Connect to postgres to create test DB
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if test database exists
    const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = 'kanban_test'
    `;
    
    const result = await client.query(checkDbQuery);
    
    if (result.rows.length === 0) {
      // Create test database if it doesn't exist
      const createDbQuery = `CREATE DATABASE kanban_test`;
      await client.query(createDbQuery);
      console.log('✅ Created test database: kanban_test');
    } else {
      console.log('✅ Test database already exists: kanban_test');
    }
    console.log('✅ Test database setup completed');

  } catch (error) {
    console.error('❌ Error setting up test database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Execute if called directly
if (require.main === module) {
  setupTestDatabase()
    .then(() => {
      console.log('🎉 Test database setup successful');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test database setup failed:', error);
      process.exit(1);
    });
}

export { setupTestDatabase }; 