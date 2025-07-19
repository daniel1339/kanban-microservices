import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';

async function cleanupExpiredTokens() {
  console.log('🧹 Iniciando limpieza de tokens expirados...');

  try {
    // Crear aplicación NestJS
    const app = await NestFactory.createApplicationContext(AppModule);
    const authService = app.get(AuthService);

    // Limpiar tokens expirados
    const cleanedCount = await authService.cleanupExpiredTokens();

    console.log(`✅ Limpieza completada: ${cleanedCount} tokens expirados eliminados`);

    // Cerrar aplicación
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  cleanupExpiredTokens();
}

export { cleanupExpiredTokens }; 