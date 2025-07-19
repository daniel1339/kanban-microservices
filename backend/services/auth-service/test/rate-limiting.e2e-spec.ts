import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ThrottlerModule } from '@nestjs/throttler';

describe('Rate Limiting (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ThrottlerModule.forRoot([{
          ttl: 1000, // 1 segundo para tests
          limit: 3,  // 3 requests máximo
        }]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should allow requests within rate limit', async () => {
      const loginData = {
        emailOrUsername: 'test@example.com',
        password: 'password123',
      };

      // Primer request - debería pasar
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(401); // Credenciales inválidas, pero no rate limit

      // Segundo request - debería pasar
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      // Tercer request - debería pasar
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(401);
    });

    it('should block requests when rate limit is exceeded', async () => {
      const loginData = {
        emailOrUsername: 'test@example.com',
        password: 'password123',
      };

      // Hacer 3 requests (dentro del límite)
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginData)
          .expect(401);
      }

      // Cuarto request - debería ser bloqueado
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(429)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 429);
          expect(res.body).toHaveProperty('message', 'ThrottlerException: Too Many Requests');
        });
    });

    it('should include rate limit headers in response', async () => {
      const loginData = {
        emailOrUsername: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      // Verificar que los headers de rate limit estén presentes
      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(response.headers).toHaveProperty('x-ratelimit-remaining');
      expect(response.headers).toHaveProperty('x-ratelimit-reset');
    });
  });

  describe('POST /auth/register', () => {
    it('should apply different rate limits for different endpoints', async () => {
      const registerData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      // Hacer múltiples requests de registro
      for (let i = 0; i < 5; i++) {
        const response = await request(app.getHttpServer())
          .post('/auth/register')
          .send({
            ...registerData,
            email: `test${i}@example.com`,
            username: `testuser${i}`,
          });

        // Los primeros deberían pasar (aunque fallen por validación)
        // Los últimos deberían ser bloqueados por rate limit
        if (i < 3) {
          expect(response.status).not.toBe(429);
        } else {
          expect(response.status).toBe(429);
        }
      }
    });
  });
}); 