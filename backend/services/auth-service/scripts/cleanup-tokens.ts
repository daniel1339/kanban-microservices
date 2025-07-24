import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';

async function cleanupExpiredTokens() {
  console.log('🧹 Starting cleanup of expired tokens...');

  try {
    // Create NestJS application
    const app = await NestFactory.createApplicationContext(AppModule);
    const authService = app.get(AuthService);

    // Clean up expired tokens
    const cleanedCount = await authService.cleanupExpiredTokens();

    console.log(`✅ Cleanup completed: ${cleanedCount} expired tokens removed`);

    // Close application
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Execute if called directly
if (require.main === module) {
  cleanupExpiredTokens();
}

export { cleanupExpiredTokens }; 