import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthHelper, AuthTokens } from './helpers/auth.helper';

describe('ProfileController (e2e)', () => {
  let app: INestApplication;
  let authTokens: AuthTokens;

  beforeAll(async () => {
    // Create a real test user for the tests
    try {
      authTokens = await AuthHelper.createTestUser();
    } catch (error) {
      console.warn('⚠️ Could not create test user, using mock tokens');
      // Fallback to mock tokens if Auth Service is not available
      authTokens = {
        accessToken: 'valid-jwt-token',
        refreshToken: 'valid-refresh-token',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'test@example.com',
          username: 'testuser',
        },
      };
    }
  });

  afterAll(async () => {
    // Clean up test user if created
    if (authTokens.accessToken !== 'valid-jwt-token') {
      await AuthHelper.cleanupTestUser(authTokens.accessToken, authTokens.refreshToken);
    }
  });

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

  describe('/profile (GET)', () => {
    it('should return profile for authenticated user with real JWT', () => {
      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${authTokens.accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('userId');
          expect(res.body).toHaveProperty('displayName');
          expect(res.body).toHaveProperty('bio');
          expect(res.body).toHaveProperty('avatarUrl');
          expect(res.body).toHaveProperty('created_at');
          expect(res.body).toHaveProperty('updated_at');
          // Verify that userId matches the authenticated user
          expect(res.body.userId).toBe(authTokens.user.id);
        });
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .get('/profile')
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 401);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Unauthorized');
        });
    });

    it('should return 401 with invalid token', () => {
      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 401);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Unauthorized');
        });
    });

    it('should return 401 with expired token', () => {
      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 401);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Unauthorized');
        });
    });

    it('should return correct content type', () => {
      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${authTokens.accessToken}`)
        .expect('Content-Type', /application\/json/);
    });

    it('should handle missing authorization header', () => {
      return request(app.getHttpServer())
        .get('/profile')
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 401);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Unauthorized');
        });
    });

    it('should handle malformed authorization header', () => {
      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', 'malformed-header')
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 401);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Unauthorized');
        });
    });
  });

  describe('/profile (PUT)', () => {
    it('should update profile with valid data using real JWT', () => {
      const updateData = {
        displayName: 'Updated Name',
        bio: 'Updated bio',
      };

      return request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', `Bearer ${authTokens.accessToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('userId');
          expect(res.body).toHaveProperty('displayName');
          expect(res.body).toHaveProperty('bio');
          expect(res.body).toHaveProperty('avatarUrl');
          expect(res.body).toHaveProperty('created_at');
          expect(res.body).toHaveProperty('updated_at');
          expect(res.body.displayName).toBe('Updated Name');
          expect(res.body.bio).toBe('Updated bio');
          expect(res.body.userId).toBe(authTokens.user.id);
        });
    });

    it('should handle partial updates', () => {
      const updateData = {
        displayName: 'Partial Update',
      };

      return request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', `Bearer ${authTokens.accessToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.displayName).toBe('Partial Update');
          expect(res.body.userId).toBe(authTokens.user.id);
        });
    });

    it('should handle empty update data', () => {
      const updateData = {};

      return request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', `Bearer ${authTokens.accessToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('userId');
          expect(res.body.userId).toBe(authTokens.user.id);
        });
    });

    it('should return 401 without authentication', () => {
      const updateData = {
        displayName: 'Test Update',
      };

      return request(app.getHttpServer())
        .put('/profile')
        .send(updateData)
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 401);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Unauthorized');
        });
    });

    it('should return 401 with invalid token', () => {
      const updateData = {
        displayName: 'Test Update',
      };

      return request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', 'Bearer invalid-token')
        .send(updateData)
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 401);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Unauthorized');
        });
    });

    it('should handle invalid JSON data', () => {
      return request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', `Bearer ${authTokens.accessToken}`)
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Bad Request');
        });
    });

    it('should return correct content type for updates', () => {
      const updateData = {
        displayName: 'Test Update',
      };

      return request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', `Bearer ${authTokens.accessToken}`)
        .send(updateData)
        .expect('Content-Type', /application\/json/);
    });

    it('should validate input data', () => {
      const invalidData = {
        displayName: '', // Empty field
        bio: 'a'.repeat(1001), // Very long bio
      };

      return request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', `Bearer ${authTokens.accessToken}`)
        .send(invalidData)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('error', 'Bad Request');
        });
    });
  });

  describe('Profile endpoints structure', () => {
    it('should have consistent response structure for GET', () => {
      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${authTokens.accessToken}`)
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

    it('should have consistent response structure for PUT', () => {
      const updateData = {
        displayName: 'Structure Test',
      };

      return request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', `Bearer ${authTokens.accessToken}`)
        .send(updateData)
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

    it('should return valid date strings', () => {
      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${authTokens.accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(() => new Date(res.body.created_at)).not.toThrow();
          expect(() => new Date(res.body.updated_at)).not.toThrow();
          expect(res.body.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
          expect(res.body.updated_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        });
    });
  });
}); 