import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

async function testRateLimiting() {
  console.log('🧪 Testing Rate Limiting...\n');

  const loginData = {
    emailOrUsername: 'test@example.com',
    password: 'password123',
  };

  console.log('📊 Making 6 quick requests to /auth/login endpoint...\n');

  for (let i = 1; i <= 6; i++) {
    const startTime = Date.now();
    
    try {
      console.log(`Request ${i}:`);
      
      const response = await axios.post(`${BASE_URL}/auth/login`, loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const endTime = Date.now();
      console.log(`  ✅ Status: ${response.status}`);
      console.log(`  ⏱️  Time: ${endTime - startTime}ms`);
      console.log(`  📊 Rate Limit Headers:`);
      console.log(`     X-RateLimit-Limit: ${response.headers['x-ratelimit-limit']}`);
      console.log(`     X-RateLimit-Remaining: ${response.headers['x-ratelimit-remaining']}`);
      console.log(`     X-RateLimit-Reset: ${response.headers['x-ratelimit-reset']}`);
      console.log('');

    } catch (error: any) {
      const endTime = Date.now();
      console.log(`  ❌ Status: ${error.response?.status || 'Network Error'}`);
      console.log(`  ⏱️  Time: ${endTime - startTime}ms`);
      
      if (error.response?.status === 429) {
        console.log(`  🚫 Rate Limit Exceeded!`);
        console.log(`  📊 Rate Limit Headers:`);
        console.log(`     X-RateLimit-Limit: ${error.response.headers['x-ratelimit-limit']}`);
        console.log(`     X-RateLimit-Remaining: ${error.response.headers['x-ratelimit-remaining']}`);
        console.log(`     X-RateLimit-Reset: ${error.response.headers['x-ratelimit-reset']}`);
        console.log(`  📝 Error Message: ${error.response.data?.message || 'Unknown error'}`);
      } else {
        console.log(`  📝 Error: ${error.message}`);
      }
      console.log('');
    }
  }

  console.log('🎯 Test completed!');
  console.log('💡 The first 5 requests should pass (even if they fail due to invalid credentials)');
  console.log('💡 The 6th request should be blocked with status 429');
}

// Execute if called directly
if (require.main === module) {
  testRateLimiting().catch(console.error);
}

export { testRateLimiting }; 