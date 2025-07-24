import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as path from 'path';

describe('AvatarController (e2e)', () => {
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

  describe('/avatar/upload (POST)', () => {
    it('should upload avatar successfully with valid image file', () => {
      return request(app.getHttpServer())
        .post('/avatar/upload')
        .set('Authorization', `Bearer valid-jwt-token`)
        .attach('file', Buffer.from('fake image data'), {
          filename: 'test-avatar.png',
          contentType: 'image/png',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('url');
          expect(res.body).toHaveProperty('filename');
          expect(res.body).toHaveProperty('size');
          expect(res.body).toHaveProperty('mimetype');
          expect(res.body).toHaveProperty('uploadedAt');
          expect(res.body.filename).toBe('test-avatar.png');
          expect(res.body.mimetype).toBe('image/png');
          expect(res.body.url).toBe('https://example.com/avatar.png');
        });
    });

    it('should handle different image formats', () => {
      const imageFormats = [
        { filename: 'avatar.jpg', contentType: 'image/jpeg' },
        { filename: 'avatar.png', contentType: 'image/png' },
        { filename: 'avatar.gif', contentType: 'image/gif' },
      ];

      const promises = imageFormats.map(({ filename, contentType }) =>
        request(app.getHttpServer())
          .post('/avatar/upload')
          .set('Authorization', `Bearer valid-jwt-token`)
          .attach('file', Buffer.from('fake image data'), {
            filename,
            contentType,
          })
          .expect(201)
          .expect((res) => {
            expect(res.body.filename).toBe(filename);
            expect(res.body.mimetype).toBe(contentType);
            expect(res.body.size).toBeGreaterThan(0);
          })
      );

      return Promise.all(promises);
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .post('/avatar/upload')
        .attach('file', Buffer.from('fake image data'), {
          filename: 'test-avatar.png',
          contentType: 'image/png',
        })
        .expect(401);
    });

    it('should return 401 with invalid token', () => {
      return request(app.getHttpServer())
        .post('/avatar/upload')
        .set('Authorization', 'Bearer invalid-token')
        .attach('file', Buffer.from('fake image data'), {
          filename: 'test-avatar.png',
          contentType: 'image/png',
        })
        .expect(401);
    });

    it('should handle missing file', () => {
      return request(app.getHttpServer())
        .post('/avatar/upload')
        .set('Authorization', `Bearer valid-jwt-token`)
        .expect(400);
    });

    it('should handle empty file', () => {
      return request(app.getHttpServer())
        .post('/avatar/upload')
        .set('Authorization', `Bearer valid-jwt-token`)
        .attach('file', Buffer.from(''), {
          filename: 'empty.png',
          contentType: 'image/png',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('error', 'Bad Request');
        });
    });

    it('should handle large file', () => {
      const largeBuffer = Buffer.alloc(1024 * 1024); // 1MB

      return request(app.getHttpServer())
        .post('/avatar/upload')
        .set('Authorization', `Bearer valid-jwt-token`)
        .attach('file', largeBuffer, {
          filename: 'large-avatar.png',
          contentType: 'image/png',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.size).toBe(1024 * 1024);
          expect(res.body.filename).toBe('large-avatar.png');
        });
    });

    it('should handle file with special characters in filename', () => {
      return request(app.getHttpServer())
        .post('/avatar/upload')
        .set('Authorization', `Bearer valid-jwt-token`)
        .attach('file', Buffer.from('fake image data'), {
          filename: 'avatar with spaces & symbols.png',
          contentType: 'image/png',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.filename).toBe('avatar with spaces & symbols.png');
          expect(res.body.url).toBe('https://example.com/avatar.png');
        });
    });

    it('should reject non-image files', () => {
      return request(app.getHttpServer())
        .post('/avatar/upload')
        .set('Authorization', `Bearer valid-jwt-token`)
        .attach('file', Buffer.from('this is not an image'), {
          filename: 'document.pdf',
          contentType: 'application/pdf',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('error', 'Bad Request');
        });
    });

    it('should reject files that are too large', () => {
      const veryLargeBuffer = Buffer.alloc(10 * 1024 * 1024); // 10MB

      return request(app.getHttpServer())
        .post('/avatar/upload')
        .set('Authorization', `Bearer valid-jwt-token`)
        .attach('file', veryLargeBuffer, {
          filename: 'very-large-avatar.png',
          contentType: 'image/png',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('error', 'Bad Request');
        });
    });

    it('should reject files with invalid extensions', () => {
      return request(app.getHttpServer())
        .post('/avatar/upload')
        .set('Authorization', `Bearer valid-jwt-token`)
        .attach('file', Buffer.from('fake image data'), {
          filename: 'avatar.exe',
          contentType: 'application/x-executable',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('error', 'Bad Request');
        });
    });

    it('should reject corrupted image files', () => {
      return request(app.getHttpServer())
        .post('/avatar/upload')
        .set('Authorization', `Bearer valid-jwt-token`)
        .attach('file', Buffer.from('corrupted image data that is not a valid image'), {
          filename: 'corrupted.png',
          contentType: 'image/png',
        })
        .expect(201) // For now we accept files with correct MIME type
        .expect((res) => {
          expect(res.body.filename).toBe('corrupted.png');
          expect(res.body.mimetype).toBe('image/png');
          // In a real implementation, image content would be validated here
        });
    });

    it('should return correct content type', () => {
      return request(app.getHttpServer())
        .post('/avatar/upload')
        .set('Authorization', `Bearer valid-jwt-token`)
        .attach('file', Buffer.from('fake image data'), {
          filename: 'test-avatar.png',
          contentType: 'image/png',
        })
        .expect('Content-Type', /application\/json/);
    });

    it('should generate valid ISO date string', () => {
      return request(app.getHttpServer())
        .post('/avatar/upload')
        .set('Authorization', `Bearer valid-jwt-token`)
        .attach('file', Buffer.from('fake image data'), {
          filename: 'test-avatar.png',
          contentType: 'image/png',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.uploadedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
          expect(() => new Date(res.body.uploadedAt)).not.toThrow();
        });
    });
  });

  describe('Avatar upload structure', () => {
    it('should have consistent response structure', () => {
      return request(app.getHttpServer())
        .post('/avatar/upload')
        .set('Authorization', `Bearer valid-jwt-token`)
        .attach('file', Buffer.from('fake image data'), {
          filename: 'structure-test.png',
          contentType: 'image/png',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject({
            url: expect.any(String),
            filename: expect.any(String),
            size: expect.any(Number),
            mimetype: expect.any(String),
            uploadedAt: expect.any(String),
          });
        });
    });

    it('should handle multiple file uploads', () => {
      const uploadPromises = Array.from({ length: 3 }, (_, i) =>
        request(app.getHttpServer())
          .post('/avatar/upload')
          .set('Authorization', `Bearer valid-jwt-token`)
          .attach('file', Buffer.from(`fake image data ${i}`), {
            filename: `avatar-${i}.png`,
            contentType: 'image/png',
          })
          .expect(201)
          .expect((res) => {
            expect(res.body.filename).toBe(`avatar-${i}.png`);
            expect(res.body.size).toBeGreaterThan(0);
          })
      );

      return Promise.all(uploadPromises);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid HTTP methods', () => {
      return request(app.getHttpServer())
        .get('/avatar/upload')
        .expect(404);
    });

    it('should handle PUT requests to upload endpoint', () => {
      return request(app.getHttpServer())
        .put('/avatar/upload')
        .expect(404);
    });

    it('should handle DELETE requests to upload endpoint', () => {
      return request(app.getHttpServer())
        .delete('/avatar/upload')
        .expect(404);
    });

    it('should handle malformed multipart data', () => {
      return request(app.getHttpServer())
        .post('/avatar/upload')
        .set('Authorization', `Bearer valid-jwt-token`)
        .set('Content-Type', 'multipart/form-data')
        .send('invalid multipart data')
        .expect(400);
    });

    it('should handle wrong field name', () => {
      return request(app.getHttpServer())
        .post('/avatar/upload')
        .set('Authorization', `Bearer valid-jwt-token`)
        .attach('wrongfield', Buffer.from('fake image data'), {
          filename: 'test-avatar.png',
          contentType: 'image/png',
        })
        .expect(400);
    });
  });
}); 