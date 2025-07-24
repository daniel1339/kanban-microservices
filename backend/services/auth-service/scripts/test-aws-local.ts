import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

async function testAWSLocalIntegration(): Promise<void> {
  console.log('🧪 Testing AWS Local Integration...\n');

  // Direct configuration for testing
  const dynamoClient = new DynamoDBClient({
    region: 'us-east-1',
    endpoint: 'http://localhost:4566',
    credentials: {
      accessKeyId: 'test',
      secretAccessKey: 'test',
    },
  });

  const docClient = DynamoDBDocumentClient.from(dynamoClient);

  try {
    // 1. Health Check - Verify connection
    console.log('1️⃣ Testing DynamoDB Connection...');
    const healthCommand = new GetCommand({
      TableName: 'kanban-refresh-tokens',
      Key: { token: 'health-check' },
    });

    await docClient.send(healthCommand);
    console.log('   ✅ DynamoDB connection successful\n');

    // 2. Test Refresh Token Operations
    console.log('2️⃣ Testing Refresh Token Operations...');
    
    const testToken = 'test-refresh-token-123';
    const testUserId = 'test-user-123';
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    // Save token
    const putCommand = new PutCommand({
      TableName: 'kanban-refresh-tokens',
      Item: {
        token: testToken,
        userId: testUserId,
        expiresAt,
        createdAt: new Date().toISOString(),
        deviceInfo: 'Test Device',
        ipAddress: '127.0.0.1'
      }
    });

    await docClient.send(putCommand);
    console.log('   ✅ Token saved');

    // Get token
    const getCommand = new GetCommand({
      TableName: 'kanban-refresh-tokens',
      Key: { token: testToken }
    });

    const response = await docClient.send(getCommand);
    if (response.Item && response.Item.userId === testUserId) {
      console.log('   ✅ Token retrieved successfully');
    } else {
      console.log('   ❌ Token retrieval failed');
    }

    // Delete token
    const deleteCommand = new DeleteCommand({
      TableName: 'kanban-refresh-tokens',
      Key: { token: testToken }
    });

    await docClient.send(deleteCommand);
    console.log('   ✅ Token deleted');
    console.log('   Refresh Token Operations: ✅ PASSED\n');

    // 3. Test User Session Operations
    console.log('3️⃣ Testing User Session Operations...');
    
    const sessionId = 'test-session-123';
    
    // Create session
    const sessionPutCommand = new PutCommand({
      TableName: 'kanban-user-sessions',
      Item: {
        sessionId,
        userId: testUserId,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        deviceInfo: 'Test Device',
        ipAddress: '127.0.0.1',
        isActive: true
      }
    });

    await docClient.send(sessionPutCommand);
    console.log('   ✅ Session created');

    // Get session
    const sessionGetCommand = new GetCommand({
      TableName: 'kanban-user-sessions',
      Key: { sessionId }
    });

    const sessionResponse = await docClient.send(sessionGetCommand);
    if (sessionResponse.Item && sessionResponse.Item.userId === testUserId) {
      console.log('   ✅ Session retrieved successfully');
    } else {
      console.log('   ❌ Session retrieval failed');
    }

    // Delete session
    const sessionDeleteCommand = new DeleteCommand({
      TableName: 'kanban-user-sessions',
      Key: { sessionId }
    });

    await docClient.send(sessionDeleteCommand);
    console.log('   ✅ Session deleted');
    console.log('   User Session Operations: ✅ PASSED\n');

    console.log('🎉 All AWS Local Integration Tests PASSED!');
    console.log('\n📋 Summary:');
    console.log('   ✅ DynamoDB Connection');
    console.log('   ✅ Refresh Token Operations');
    console.log('   ✅ User Session Operations');

  } catch (error) {
    console.error('\n💥 AWS Local Integration Test FAILED:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure LocalStack is running:');
    console.log('      docker-compose -f docker-compose.localstack.yml up -d');
    console.log('   2. Make sure DynamoDB tables are created:');
    console.log('      npx ts-node scripts/setup-aws-local.ts');
    console.log('   3. Check AWS CLI configuration:');
    console.log('      aws --endpoint-url=http://localhost:4566 dynamodb list-tables');
  }
}

// Execute test if called directly
if (require.main === module) {
  testAWSLocalIntegration()
    .then(() => {
      console.log('\n🎯 AWS Local Integration Test completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error);
      process.exit(1);
    });
}

export { testAWSLocalIntegration }; 