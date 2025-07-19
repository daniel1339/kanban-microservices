import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Rate Limiting (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ThrottlerModule.forRoot([
          {
            ttl: 60000, // 1 minute
            limit: 5, // 5 requests per minute
          },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should allow 5 requests per minute', async () => {
      const registerData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        passwordConfirmation: 'Password123!',
      };

      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        const response = await request(app.getHttpServer())
          .post('/auth/register')
          .send(registerData)
          .expect(400); // Will fail due to validation, but rate limiting should allow it

        expect(response.headers['x-ratelimit-limit']).toBe('5');
        expect(response.headers['x-ratelimit-remaining']).toBe((4 - i).toString());
      }
    });

    it('should block requests after limit exceeded', async () => {
      const registerData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        passwordConfirmation: 'Password123!',
      };

      // Make 6 requests (exceeding limit)
      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer())
          .post('/auth/register')
          .send(registerData)
          .expect(400);
      }

      // 6th request should be blocked
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(429); // Too Many Requests

      expect(response.body.message).toContain('ThrottlerException');
    });
  });

  describe('POST /auth/login', () => {
    it('should allow 5 requests per minute', async () => {
      const loginData = {
        emailOrUsername: 'test@example.com',
        password: 'Password123!',
      };

      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginData)
          .expect(401); // Will fail due to invalid credentials, but rate limiting should allow it

        expect(response.headers['x-ratelimit-limit']).toBe('5');
        expect(response.headers['x-ratelimit-remaining']).toBe((4 - i).toString());
      }
    });

    it('should block requests after limit exceeded', async () => {
      const loginData = {
        emailOrUsername: 'test@example.com',
        password: 'Password123!',
      };

      // Make 6 requests (exceeding limit)
      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginData)
          .expect(401);
      }

      // 6th request should be blocked
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(429); // Too Many Requests

      expect(response.body.message).toContain('ThrottlerException');
    });
  });

  describe('POST /auth/refresh', () => {
    it('should allow 5 requests per minute', async () => {
      const refreshData = {
        refreshToken: 'invalid-token',
      };

      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        const response = await request(app.getHttpServer())
          .post('/auth/refresh')
          .send(refreshData)
          .expect(401); // Will fail due to invalid token, but rate limiting should allow it

        expect(response.headers['x-ratelimit-limit']).toBe('5');
        expect(response.headers['x-ratelimit-remaining']).toBe((4 - i).toString());
      }
    });
  });

  describe('Rate limit headers', () => {
    it('should include proper rate limit headers', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'Password123!',
          passwordConfirmation: 'Password123!',
        })
        .expect(400);

      expect(response.headers['x-ratelimit-limit']).toBe('5');
      expect(response.headers['x-ratelimit-remaining']).toBe('4');
      expect(response.headers['x-ratelimit-reset']).toBeDefined();
    });
  });

  describe('Different IP addresses', () => {
    it('should track rate limits per IP address', async () => {
      const registerData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123!',
        passwordConfirmation: 'Password123!',
      };

      // Make requests from different IPs
      const ip1 = '192.168.1.1';
      const ip2 = '192.168.1.2';

      // IP1: 3 requests
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/auth/register')
          .set('X-Forwarded-For', ip1)
          .send(registerData)
          .expect(400);
      }

      // IP2: 3 requests (should work independently)
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer())
          .post('/auth/register')
          .set('X-Forwarded-For', ip2)
          .send(registerData)
          .expect(400);
      }

      // Both IPs should still have remaining requests
      const response1 = await request(app.getHttpServer())
        .post('/auth/register')
        .set('X-Forwarded-For', ip1)
        .send(registerData)
        .expect(400);

      const response2 = await request(app.getHttpServer())
        .post('/auth/register')
        .set('X-Forwarded-For', ip2)
        .send(registerData)
        .expect(400);

      expect(response1.headers['x-ratelimit-remaining']).toBe('1');
      expect(response2.headers['x-ratelimit-remaining']).toBe('1');
    });
  });
}); 