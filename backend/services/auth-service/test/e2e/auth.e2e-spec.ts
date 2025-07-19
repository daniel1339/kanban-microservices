import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppModule } from '../../src/app.module';
import { User, RefreshToken } from '../../src/auth/entities';
import { mockUsers, mockRegisterDto, mockLoginDto, mockRefreshTokenDto } from '../fixtures';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_URL,
          entities: [User, RefreshToken],
          synchronize: true, // Solo para tests
          logging: false,
          ssl: false,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 30000); // Timeout de 30 segundos

  beforeEach(async () => {
    // Limpiar variables entre tests
    accessToken = '';
    refreshToken = '';
    userId = '';
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  }, 10000);

  describe('/auth/register (POST)', () => {
    it('should register a new user successfully', () => {
      const uniqueRegisterDto = {
        ...mockRegisterDto,
        email: `test-${Date.now()}@example.com`,
        username: `testuser-${Date.now()}`,
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(uniqueRegisterDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          expect(res.body).toHaveProperty('expiresIn');
          expect(res.body.user.email).toBe(uniqueRegisterDto.email);
          expect(res.body.user.username).toBe(uniqueRegisterDto.username);
          
          // Guardar tokens para tests posteriores
          accessToken = res.body.accessToken;
          refreshToken = res.body.refreshToken;
          userId = res.body.user.id;
        });
    });

    it('should fail when passwords do not match', () => {
      const invalidData = { 
        ...mockRegisterDto, 
        email: `test-${Date.now()}@example.com`,
        username: `testuser-${Date.now()}`,
        passwordConfirmation: 'different' 
      };
      
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidData)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body.statusCode).toBe(400);
          expect(res.body.message).toContain('Las contraseñas no coinciden');
        });
    });

    it('should fail when email already exists', () => {
      const existingEmail = `existing-${Date.now()}@example.com`;
      
      // Primero crear un usuario
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...mockRegisterDto,
          email: existingEmail,
          username: `user1-${Date.now()}`,
        })
        .expect(201)
        .then(() => {
          // Luego intentar crear otro con el mismo email
          return request(app.getHttpServer())
            .post('/auth/register')
            .send({
              ...mockRegisterDto,
              email: existingEmail,
              username: `user2-${Date.now()}`,
            })
            .expect(409)
            .expect((res) => {
              expect(res.body).toHaveProperty('error');
              expect(res.body).toHaveProperty('message');
              expect(res.body).toHaveProperty('statusCode');
              expect(res.body.statusCode).toBe(409);
              expect(res.body.message).toContain('El email ya está registrado');
            });
        });
    });

    it('should fail when username already exists', () => {
      const existingUsername = `existinguser-${Date.now()}`;
      
      // Primero crear un usuario
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...mockRegisterDto,
          email: `email1-${Date.now()}@example.com`,
          username: existingUsername,
        })
        .expect(201)
        .then(() => {
          // Luego intentar crear otro con el mismo username
          return request(app.getHttpServer())
            .post('/auth/register')
            .send({
              ...mockRegisterDto,
              email: `email2-${Date.now()}@example.com`,
              username: existingUsername,
            })
            .expect(409)
            .expect((res) => {
              expect(res.body).toHaveProperty('error');
              expect(res.body).toHaveProperty('message');
              expect(res.body).toHaveProperty('statusCode');
              expect(res.body.statusCode).toBe(409);
              expect(res.body.message).toContain('El username ya está en uso');
            });
        });
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login successfully with email', () => {
      const loginEmail = `login-${Date.now()}@example.com`;
      const loginUsername = `loginuser-${Date.now()}`;
      
      // Primero registrar un usuario
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...mockRegisterDto,
          email: loginEmail,
          username: loginUsername,
        })
        .expect(201)
        .then(() => {
          // Luego hacer login
          return request(app.getHttpServer())
            .post('/auth/login')
            .send({
              emailOrUsername: loginEmail,
              password: mockRegisterDto.password,
            })
            .expect(200)
            .expect((res) => {
              expect(res.body).toHaveProperty('user');
              expect(res.body).toHaveProperty('accessToken');
              expect(res.body).toHaveProperty('refreshToken');
              expect(res.body).toHaveProperty('expiresIn');
              expect(res.body.user.email).toBe(loginEmail);
              
              // Guardar tokens para tests posteriores
              accessToken = res.body.accessToken;
              refreshToken = res.body.refreshToken;
            });
        });
    });

    it('should login successfully with username', () => {
      const loginEmail = `login2-${Date.now()}@example.com`;
      const loginUsername = `loginuser2-${Date.now()}`;
      
      // Primero registrar un usuario
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...mockRegisterDto,
          email: loginEmail,
          username: loginUsername,
        })
        .expect(201)
        .then(() => {
          // Luego hacer login con username
          return request(app.getHttpServer())
            .post('/auth/login')
            .send({
              emailOrUsername: loginUsername,
              password: mockRegisterDto.password,
            })
            .expect(200)
            .expect((res) => {
              expect(res.body).toHaveProperty('user');
              expect(res.body).toHaveProperty('accessToken');
              expect(res.body).toHaveProperty('refreshToken');
              expect(res.body).toHaveProperty('expiresIn');
            });
        });
    });

    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          emailOrUsername: 'nonexistent@example.com',
          password: 'wrongpassword',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body.statusCode).toBe(401);
          expect(res.body.message).toContain('Credenciales inválidas');
        });
    });

    it('should fail with non-existent user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          emailOrUsername: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body.statusCode).toBe(401);
          expect(res.body.message).toContain('Credenciales inválidas');
        });
    });
  });

  describe('/auth/refresh (POST)', () => {
    it('should refresh token successfully', () => {
      const refreshEmail = `refresh-${Date.now()}@example.com`;
      const refreshUsername = `refreshuser-${Date.now()}`;
      
      // Primero registrar y hacer login
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...mockRegisterDto,
          email: refreshEmail,
          username: refreshUsername,
        })
        .expect(201)
        .then((registerRes) => {
          const refreshToken = registerRes.body.refreshToken;
          
          // Luego refrescar el token
          return request(app.getHttpServer())
            .post('/auth/refresh')
            .send({ refreshToken })
            .expect(200)
            .expect((res) => {
              expect(res.body).toHaveProperty('user');
              expect(res.body).toHaveProperty('accessToken');
              expect(res.body).toHaveProperty('refreshToken');
              expect(res.body).toHaveProperty('expiresIn');
            });
        });
    });

    it('should fail with invalid refresh token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body.statusCode).toBe(401);
          expect(res.body.message).toContain('Refresh token inválido');
        });
    });
  });

  describe('/auth/profile (GET)', () => {
    it('should get user profile successfully with valid token', () => {
      const profileEmail = `profile-${Date.now()}@example.com`;
      const profileUsername = `profileuser-${Date.now()}`;
      
      // Primero registrar y hacer login
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...mockRegisterDto,
          email: profileEmail,
          username: profileUsername,
        })
        .expect(201)
        .then((registerRes) => {
          const accessToken = registerRes.body.accessToken;
          
          // Luego obtener el perfil
          return request(app.getHttpServer())
            .get('/auth/profile')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
            .expect((res) => {
              expect(res.body).toHaveProperty('id');
              expect(res.body).toHaveProperty('email');
              expect(res.body).toHaveProperty('username');
              expect(res.body).toHaveProperty('isVerified');
              expect(res.body).toHaveProperty('createdAt');
              expect(res.body).toHaveProperty('updatedAt');
            });
        });
    });

    it('should fail without authorization header', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body.statusCode).toBe(401);
          expect(res.body.message).toContain('Token de acceso requerido');
        });
    });

    it('should fail with invalid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body.statusCode).toBe(401);
          expect(res.body.message).toContain('Token inválido');
        });
    });
  });

  describe('/auth/validate (POST)', () => {
    it('should validate credentials successfully', () => {
      const validateEmail = `validate-${Date.now()}@example.com`;
      const validateUsername = `validateuser-${Date.now()}`;
      
      // Primero registrar un usuario
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...mockRegisterDto,
          email: validateEmail,
          username: validateUsername,
        })
        .expect(201)
        .then(() => {
          // Luego validar credenciales
          return request(app.getHttpServer())
            .post('/auth/validate')
            .send({
              emailOrUsername: validateEmail,
              password: mockRegisterDto.password,
            })
            .expect(200)
            .expect((res) => {
              expect(res.body).toHaveProperty('isValid');
              expect(res.body.isValid).toBe(true);
            });
        });
    });

    it('should return false for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/validate')
        .send({
          emailOrUsername: 'nonexistent@example.com',
          password: 'wrongpassword',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('isValid');
          expect(res.body.isValid).toBe(false);
        });
    });
  });

  describe('/auth/logout (POST)', () => {
    it('should logout successfully', () => {
      const logoutEmail = `logout-${Date.now()}@example.com`;
      const logoutUsername = `logoutuser-${Date.now()}`;
      
      // Primero registrar y hacer login
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...mockRegisterDto,
          email: logoutEmail,
          username: logoutUsername,
        })
        .expect(201)
        .then((registerRes) => {
          const accessToken = registerRes.body.accessToken;
          const refreshToken = registerRes.body.refreshToken;
          
          // Luego hacer logout
          return request(app.getHttpServer())
            .post('/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ refreshToken })
            .expect(204);
        });
    });

    it('should fail without authorization header', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .send({ refreshToken: 'some-token' })
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body.statusCode).toBe(401);
          expect(res.body.message).toContain('Token de acceso requerido');
        });
    });
  });
}); 