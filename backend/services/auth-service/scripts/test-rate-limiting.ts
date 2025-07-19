import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

async function testRateLimiting() {
  console.log('🧪 Probando Rate Limiting...\n');

  const loginData = {
    emailOrUsername: 'test@example.com',
    password: 'password123',
  };

  console.log('📊 Haciendo 6 requests rápidos al endpoint /auth/login...\n');

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
      console.log(`  ⏱️  Tiempo: ${endTime - startTime}ms`);
      console.log(`  📊 Rate Limit Headers:`);
      console.log(`     X-RateLimit-Limit: ${response.headers['x-ratelimit-limit']}`);
      console.log(`     X-RateLimit-Remaining: ${response.headers['x-ratelimit-remaining']}`);
      console.log(`     X-RateLimit-Reset: ${response.headers['x-ratelimit-reset']}`);
      console.log('');

    } catch (error: any) {
      const endTime = Date.now();
      console.log(`  ❌ Status: ${error.response?.status || 'Network Error'}`);
      console.log(`  ⏱️  Tiempo: ${endTime - startTime}ms`);
      
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

  console.log('🎯 Test completado!');
  console.log('💡 Los primeros 5 requests deberían pasar (aunque fallen por credenciales inválidas)');
  console.log('💡 El 6to request debería ser bloqueado con status 429');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testRateLimiting().catch(console.error);
}

export { testRateLimiting }; 