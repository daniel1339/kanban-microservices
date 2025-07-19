import { Client } from 'pg';

async function setupTestDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'kanban_user',
    password: 'kanban_password',
    database: 'postgres', // Conectar a postgres para crear la DB de test
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Verificar si la base de datos de test existe
    const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = 'kanban_test'
    `;
    
    const result = await client.query(checkDbQuery);
    
    if (result.rows.length === 0) {
      // Crear base de datos de test si no existe
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

// Ejecutar si se llama directamente
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