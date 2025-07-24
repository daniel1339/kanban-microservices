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
          ttl: 1000, // 1 second for tests
          limit: 3,  // 3 requests maximum
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

      // First request - should pass
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(401); // Invalid credentials, but not rate limit

      // Second request - should pass
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      // Third request - should pass
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

      // Make 3 requests (within limit)
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginData)
          .expect(401);
      }

      // Fourth request - should be blocked
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

      // Verify that rate limit headers are present
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
        confirmPassword: 'password123',
      };

      // Make multiple registration attempts
      for (let i = 0; i < 5; i++) {
        const response = await request(app.getHttpServer())
          .post('/auth/register')
          .send({
            ...registerData,
            email: `test${i}@example.com`,
            username: `testuser${i}`,
          });

        // Should get 409 (conflict) or 201 (created), not 429 (rate limit)
        expect([201, 409]).toContain(response.status);
      }
    });
  });

  describe('Rate Limit Reset', () => {
    it('should reset rate limit after TTL expires', async () => {
      const loginData = {
        emailOrUsername: 'test@example.com',
        password: 'password123',
      };

      // Make 3 requests to hit the limit
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginData)
          .expect(401);
      }

      // Fourth request should be blocked
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(429);

      // Wait for TTL to expire (1 second)
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Next request should pass again
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(401);
    });
  });
}); 