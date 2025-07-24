import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('HealthController (e2e)', () => {
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

  it('/health (GET) should respond with status ok', async () => {
    const res = await request(app.getHttpServer())
      .get('/health')
      .set('Authorization', 'Bearer valid-jwt-token');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('service', 'api-gateway');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('/health/services (GET) should respond with a list of services', async () => {
    const res = await request(app.getHttpServer())
      .get('/health/services')
      .set('Authorization', 'Bearer valid-jwt-token');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('services');
    expect(Array.isArray(res.body.services)).toBe(true);
    expect(res.body).toHaveProperty('timestamp');
    // There should be at least 'auth' and 'user' services
    const serviceNames = res.body.services.map((s: any) => s.name);
    expect(serviceNames).toContain('auth');
    expect(serviceNames).toContain('user');
  });
}); 