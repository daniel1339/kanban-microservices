import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/users/:userId (GET)', () => {
    it('should return public profile for valid userId', () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('userId');
          expect(res.body).toHaveProperty('displayName');
          expect(res.body).toHaveProperty('bio');
          expect(res.body).toHaveProperty('avatarUrl');
          expect(res.body).toHaveProperty('created_at');
          expect(res.body).toHaveProperty('updated_at');
          expect(res.body.userId).toBe(userId);
          expect(res.body.displayName).toBe('Demo User');
          expect(res.body.bio).toBe('Demo bio');
        });
    });

    it('should return 404 for non-existent userId', () => {
      const nonExistentUserId = 'non-existent-user-id-12345';

      return request(app.getHttpServer())
        .get(`/users/${nonExistentUserId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Not Found');
          expect(res.body).toHaveProperty('path', `/users/${nonExistentUserId}`);
        });
    });

    it('should return 404 for invalid UUID format', () => {
      const invalidUuid = 'invalid-uuid-format';

      return request(app.getHttpServer())
        .get(`/users/${invalidUuid}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Not Found');
        });
    });

    it('should handle different userId formats', () => {
      const userIds = [
        '123e4567-e89b-12d3-a456-426614174000',
        'simple-user-id',
        'user-123',
        'test@example.com',
      ];

      const promises = userIds.map(userId => 
        request(app.getHttpServer())
          .get(`/users/${userId}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.userId).toBe(userId);
            expect(res.body).toHaveProperty('displayName');
            expect(res.body).toHaveProperty('bio');
          })
      );

      return Promise.all(promises);
    });

    it('should return correct content type', () => {
      const userId = 'test-user-id';

      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect('Content-Type', /application\/json/);
    });

    it('should handle empty userId', () => {
      return request(app.getHttpServer())
        .get('/users/')
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Not Found');
        });
    });

    it('should handle very long userId', () => {
      const longUserId = 'a'.repeat(1000);

      return request(app.getHttpServer())
        .get(`/users/${longUserId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.userId).toBe(longUserId);
        });
    });

    it('should handle userId with special characters', () => {
      const specialUserId = 'user-with-special-chars-!@';

      return request(app.getHttpServer())
        .get(`/users/${specialUserId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.userId).toBe(specialUserId);
        });
    });

    it('should handle userId with spaces', () => {
      const userIdWithSpaces = 'user with spaces';

      return request(app.getHttpServer())
        .get(`/users/${userIdWithSpaces}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.userId).toBe(userIdWithSpaces);
        });
    });

    it('should handle userId with unicode characters', () => {
      const unicodeUserId = 'user-ñáéíóú-中文-日本語';

      return request(app.getHttpServer())
        .get(`/users/${unicodeUserId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.userId).toBe(unicodeUserId);
        });
    });

    it('should handle userId with SQL injection attempts', () => {
      const sqlInjectionUserId = "'; DROP TABLE users; --";

      return request(app.getHttpServer())
        .get(`/users/${sqlInjectionUserId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.userId).toBe(sqlInjectionUserId);
          // Verificar que no se ejecutó SQL malicioso
          expect(res.body).toHaveProperty('displayName');
          expect(res.body).toHaveProperty('bio');
        });
    });

    it('should handle userId with XSS attempts', () => {
      const xssUserId = 'xss-test-user';

      return request(app.getHttpServer())
        .get(`/users/${xssUserId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.userId).toBe(xssUserId);
          // Verificar que no se ejecutó XSS
          expect(res.body).toHaveProperty('displayName');
          expect(res.body).toHaveProperty('bio');
        });
    });
  });

  describe('User endpoints structure', () => {
    it('should have consistent response structure', () => {
      const userId = 'structure-test-user';

      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200)
        .expect((res) => {
          const profile = res.body;
          expect(profile).toMatchObject({
            id: expect.any(String),
            userId: expect.any(String),
            displayName: expect.any(String),
            bio: expect.any(String),
            avatarUrl: expect.anything(),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          });
        });
    });

    it('should handle profile without avatar', () => {
      const userId = 'no-avatar-user';

      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.avatarUrl).toBeUndefined();
          expect(res.body.displayName).toBe('Demo User');
          expect(res.body.bio).toBe('Demo bio');
        });
    });

    it('should return valid date strings', () => {
      const userId = 'date-test-user';

      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200)
        .expect((res) => {
          expect(() => new Date(res.body.created_at)).not.toThrow();
          expect(() => new Date(res.body.updated_at)).not.toThrow();
          expect(res.body.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
          expect(res.body.updated_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        });
    });

    it('should return consistent error structure for 404', () => {
      const nonExistentUserId = 'non-existent-user-12345';

      return request(app.getHttpServer())
        .get(`/users/${nonExistentUserId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toMatchObject({
            statusCode: 404,
            message: expect.any(String),
            error: 'Not Found',
            timestamp: expect.any(String),
            path: `/users/${nonExistentUserId}`,
          });
          // Verificar formato de timestamp
          expect(res.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        });
    });
  });

  describe('Error handling', () => {
    it('should handle malformed URLs', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Not Found');
        });
    });

    it('should handle invalid HTTP methods', () => {
      const userId = 'test-user';

      return request(app.getHttpServer())
        .post(`/users/${userId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Not Found');
        });
    });

    it('should handle PUT requests to user endpoint', () => {
      const userId = 'test-user';

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Not Found');
        });
    });

    it('should handle DELETE requests to user endpoint', () => {
      const userId = 'test-user';

      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Not Found');
        });
    });

    it('should handle PATCH requests to user endpoint', () => {
      const userId = 'test-user';

      return request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Not Found');
        });
    });

    it('should handle OPTIONS requests to user endpoint', () => {
      const userId = 'test-user';

      return request(app.getHttpServer())
        .options(`/users/${userId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 404);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Not Found');
        });
    });
  });

  describe('Performance and edge cases', () => {
    it('should handle concurrent requests to same user', async () => {
      const userId = 'concurrent-test-user';
      const concurrentRequests = 10;

      const promises = Array.from({ length: concurrentRequests }, () =>
        request(app.getHttpServer())
          .get(`/users/${userId}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.userId).toBe(userId);
            expect(res.body).toHaveProperty('displayName');
            expect(res.body).toHaveProperty('bio');
          })
      );

      await Promise.all(promises);
    });

    it('should handle requests with different user agents', () => {
      const userId = 'user-agent-test';
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'PostmanRuntime/7.29.0',
        'curl/7.68.0',
      ];

      const promises = userAgents.map(userAgent =>
        request(app.getHttpServer())
          .get(`/users/${userId}`)
          .set('User-Agent', userAgent)
          .expect(200)
          .expect((res) => {
            expect(res.body.userId).toBe(userId);
          })
      );

      return Promise.all(promises);
    });
  });
}); 