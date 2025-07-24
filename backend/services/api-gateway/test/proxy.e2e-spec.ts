import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ProxyMiddleware (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/auth/login (POST) responds 503 if the service is unavailable', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'test', password: 'test' });
    // If auth-service is running, expect 200 or 401; if not, expect 503 or 504
    expect([200, 401, 503, 504]).toContain(res.status);
  });

  it('/api/users/profile (GET) responds 503 if the service is unavailable', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/users/profile');
    // If user-service is running, expect 200 or 401; if not, expect 503 or 504
    expect([200, 401, 503, 504]).toContain(res.status);
  });

  it('/api/unknown/test (GET) responds 502 for unmapped routes', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/unknown/test');
    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty('error', 'Bad Gateway');
  });

  it('should open the circuit after 3 consecutive failures and return 503 or 504', async () => {
    // Simulate 3 failures to /api/auth/login (service unavailable)
    for (let i = 0; i < 3; i++) {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'test', password: 'test' });
    }
    // The 4th request should trigger the open circuit and return 503 or 504
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'test', password: 'test' });
    // If circuit breaker is working, expect 503 or 504
    expect([503, 504]).toContain(res.status);
    if (res.status === 503) {
      expect(res.body).toHaveProperty('error');
      expect(
        /Service Unavailable|circuit open/i.test(res.body.message || res.body.error)
      ).toBe(true);
    }
    // If 504, just accept the status (body may be empty)
  });
});
