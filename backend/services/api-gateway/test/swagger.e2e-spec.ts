import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { SwaggerConfig } from '../src/docs/swagger.config';

describe('Swagger (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    SwaggerConfig.setup(app); // <-- Ahora antes de app.init()
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/docs (GET) should return Swagger UI HTML', async () => {
    const res = await request(app.getHttpServer()).get('/api/docs');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Kanban API Gateway');
    expect(res.text).toContain('swagger-ui');
  });
}); 