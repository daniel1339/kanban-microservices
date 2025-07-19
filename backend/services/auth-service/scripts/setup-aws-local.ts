import { DynamoDBClient, CreateTableCommand, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Configuración para AWS Local (LocalStack)
const AWS_CONFIG = {
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test'
  }
};

const dynamoClient = new DynamoDBClient(AWS_CONFIG);
const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Definición de tablas para Auth Service
const TABLES = {
  refreshTokens: {
    TableName: 'kanban-refresh-tokens',
    KeySchema: [
      { AttributeName: 'token', KeyType: 'HASH' } // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'token', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'expiresAt', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST',
    GlobalSecondaryIndexes: [
      {
        IndexName: 'user-token-index',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' },
          { AttributeName: 'expiresAt', KeyType: 'RANGE' }
        ],
        AttributeDefinitions: [
          { AttributeName: 'userId', AttributeType: 'S' },
          { AttributeName: 'expiresAt', AttributeType: 'S' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        }
      }
    ]
  },
  userSessions: {
    TableName: 'kanban-user-sessions',
    KeySchema: [
      { AttributeName: 'sessionId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'sessionId', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'createdAt', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST',
    GlobalSecondaryIndexes: [
      {
        IndexName: 'user-sessions-index',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' },
          { AttributeName: 'createdAt', KeyType: 'RANGE' }
        ],
        AttributeDefinitions: [
          { AttributeName: 'userId', AttributeType: 'S' },
          { AttributeName: 'createdAt', AttributeType: 'S' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        }
      }
    ]
  },
  rateLimits: {
    TableName: 'kanban-rate-limits',
    KeySchema: [
      { AttributeName: 'key', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'key', AttributeType: 'S' }
    ],
    BillingMode: 'PAY_PER_REQUEST',
    TimeToLiveSpecification: {
      AttributeName: 'expiresAt',
      Enabled: true
    }
  }
};

async function listTables(): Promise<string[]> {
  try {
    const command = new ListTablesCommand({});
    const response = await dynamoClient.send(command);
    return response.TableNames || [];
  } catch (error) {
    console.error('Error listing tables:', error);
    return [];
  }
}

async function createTable(tableDefinition: any): Promise<boolean> {
  try {
    const command = new CreateTableCommand(tableDefinition);
    await dynamoClient.send(command);
    console.log(`✅ Table ${tableDefinition.TableName} created successfully`);
    return true;
  } catch (error: any) {
    if (error.name === 'ResourceInUseException') {
      console.log(`ℹ️  Table ${tableDefinition.TableName} already exists`);
      return true;
    }
    console.error(`❌ Error creating table ${tableDefinition.TableName}:`, error);
    return false;
  }
}

async function setupAWSLocal(): Promise<void> {
  console.log('🚀 Setting up AWS Local for Auth Service...\n');

  // Verificar conexión con LocalStack
  try {
    const existingTables = await listTables();
    console.log('📋 Existing tables:', existingTables);
  } catch (error) {
    console.error('❌ Cannot connect to LocalStack. Make sure it\'s running:');
    console.error('   docker-compose -f docker-compose.localstack.yml up -d');
    process.exit(1);
  }

  // Crear tablas
  console.log('\n📦 Creating DynamoDB tables...\n');

  const results = await Promise.allSettled([
    createTable(TABLES.refreshTokens),
    createTable(TABLES.userSessions),
    createTable(TABLES.rateLimits)
  ]);

  const successCount = results.filter(result => 
    result.status === 'fulfilled' && result.value
  ).length;

  console.log(`\n📊 Setup completed: ${successCount}/3 tables created successfully`);

  if (successCount === 3) {
    console.log('\n✅ AWS Local setup completed successfully!');
    console.log('\n📋 Available tables:');
    console.log('   - kanban-refresh-tokens (for JWT refresh tokens)');
    console.log('   - kanban-user-sessions (for user sessions)');
    console.log('   - kanban-rate-limits (for rate limiting)');
    
    console.log('\n🔧 Next steps:');
    console.log('   1. Configure Auth Service to use DynamoDB local');
    console.log('   2. Update environment variables');
    console.log('   3. Test AWS local integration');
  } else {
    console.log('\n⚠️  Some tables failed to create. Check the errors above.');
  }
}

// Ejecutar setup si se llama directamente
if (require.main === module) {
  setupAWSLocal()
    .then(() => {
      console.log('\n🎉 AWS Local setup finished!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Setup failed:', error);
      process.exit(1);
    });
}

export { setupAWSLocal, TABLES, AWS_CONFIG }; 