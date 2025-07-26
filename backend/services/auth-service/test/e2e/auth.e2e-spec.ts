import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getDataSourceToken } from '@nestjs/typeorm';
import { cleanDatabase } from '../utils/db-cleaner';
import { DataSource } from 'typeorm';

import { AppModule } from '../../src/app.module';
import { User, RefreshToken } from '../../src/auth/entities';
import { mockUsers, mockRegisterDto, mockLoginDto, mockRefreshTokenDto } from '../fixtures';
import { ValidationPipe as CustomValidationPipe } from '../../src/common/pipes/validation.pipe';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new CustomValidationPipe());
    await app.init();
    dataSource = app.get(getDataSourceToken());
    await cleanDatabase(dataSource); // Clean database only at start
  }, 30000); // 30 second timeout

  // Remove or comment the beforeEach that cleans the database
  // beforeEach(async () => {
  //   await cleanDatabase(dataSource);
  //   // Clear variables between tests
  //   accessToken = '';
  //   refreshToken = '';
  //   userId = '';
  // });

  afterAll(async () => {
    if (app) {
      await app.close();
      // Close DynamoDBService if it exists
      try {
        const dynamoService = app.get(
          require('../../src/common/services/dynamodb.service').DynamoDBService
        );
        if (dynamoService && typeof dynamoService.close === 'function') {
          await dynamoService.close();
        }
      } catch (e) {
        // Ignore if not registered
      }
    }
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }, 10000);

  describe('/auth/register (POST)', () => {
    it('should register a new user successfully', () => {
      const uniqueRegisterDto = {
        ...mockRegisterDto,
        email: `test_${Date.now()}@example.com`,
        username: `testuser_${Date.now()}`,
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
        email: `test_${Date.now()}@example.com`,
        username: `testuser_${Date.now()}`,
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
          expect(res.body.message).toContain('Passwords do not match');
        });
    });

    it('should fail when email already exists', () => {
      const existingEmail = `existing_${Date.now()}@example.com`;
      
      // Primero crear un usuario
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...mockRegisterDto,
          email: existingEmail,
          username: `user1_${Date.now()}`,
        })
        .expect(201)
        .then(() => {
          // Luego intentar crear otro con el mismo email
          return request(app.getHttpServer())
            .post('/auth/register')
            .send({
              ...mockRegisterDto,
              email: existingEmail,
              username: `user2_${Date.now()}`,
            })
            .expect(409)
            .expect((res) => {
              expect(res.body).toHaveProperty('error');
              expect(res.body).toHaveProperty('message');
              expect(res.body).toHaveProperty('statusCode');
              expect(res.body.statusCode).toBe(409);
              expect(res.body.message).toContain('Email is already registered');
            });
        });
    });

    it('should fail when username already exists', () => {
      const existingUsername = `existinguser_${Date.now()}`;
      
      // Primero crear un usuario
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...mockRegisterDto,
          email: `email1_${Date.now()}@example.com`,
          username: existingUsername,
        })
        .expect(201)
        .then(() => {
          // Luego intentar crear otro con el mismo username
          return request(app.getHttpServer())
            .post('/auth/register')
            .send({
              ...mockRegisterDto,
              email: `email2_${Date.now()}@example.com`,
              username: existingUsername,
            })
            .expect(409)
            .expect((res) => {
              expect(res.body).toHaveProperty('error');
              expect(res.body).toHaveProperty('message');
              expect(res.body).toHaveProperty('statusCode');
              expect(res.body.statusCode).toBe(409);
              expect(res.body.message).toContain('Username is already in use');
            });
        });
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login successfully with email', () => {
      const loginEmail = `login_${Date.now()}@example.com`;
      const loginUsername = `loginuser_${Date.now()}`;
      
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
      const loginEmail = `login2_${Date.now()}@example.com`;
      const loginUsername = `loginuser2_${Date.now()}`;
      
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
          expect(res.body.message).toContain('Invalid credentials');
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
          expect(res.body.message).toContain('Invalid credentials');
        });
    });
  });

  describe('/auth/refresh (POST)', () => {
    it('should refresh token successfully', () => {
      const refreshEmail = `refresh_${Date.now()}@example.com`;
      const refreshUsername = `refreshuser_${Date.now()}`;
      
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
          expect(res.body.message).toContain('Invalid refresh token');
        });
    });
  });

  describe('/auth/profile (GET)', () => {
    it('should get user profile successfully with valid token', () => {
      const profileEmail = `profile_${Date.now()}@example.com`;
      const profileUsername = `profileuser_${Date.now()}`;
      // Primero registrar y hacer login
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...mockRegisterDto,
          email: profileEmail,
          username: profileUsername,
        })
        .expect(201)
        .then(async (registerRes) => {
          const accessToken = registerRes.body.accessToken;
          const user = registerRes.body.user;
          const jwt = require('jsonwebtoken');
          const payload = jwt.decode(accessToken);

          // Consultar la base de datos directamente por el userId (sub)
          const { User } = require('../../src/auth/entities/user.entity');
          const userFromDb = await dataSource.getRepository(User).findOne({ where: { id: payload.sub } });

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
          expect(res.body.message).toContain('Access token required');
        });
    }); 

    it('should fail with invalid token', () => {
      // Token con formato JWT válido pero firma inválida
      const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWtlLXVzZXItaWQiLCJlbWFpbCI6ImZha2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMDAwMH0.invalidsignature';
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${fakeJwt}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toHaveProperty('error');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body.statusCode).toBe(401);
          expect(res.body.message).toContain('Invalid token');
        });
    });
  });

  describe('/auth/validate (POST)', () => {
    it('should validate credentials successfully', () => {
      const validateEmail = `validate_${Date.now()}@example.com`;
      const validateUsername = `validateuser_${Date.now()}`;
      
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
      const logoutEmail = `logout_${Date.now()}@example.com`;
      const logoutUsername = `logoutuser_${Date.now()}`;
      
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
          expect(res.body.message).toContain('Access token required');
        });
    });
  });
}); 

describe('Global errors and edge cases', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new CustomValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 404 for non-existent routes', () => {
    return request(app.getHttpServer())
      .get('/ruta-que-no-existe')
      .expect(404)
      .expect((res) => {
        expect(res.body.statusCode).toBe(404);
      });
  });
});

// Opcional: Test para IpFilterGuard (si está activo globalmente o en alguna ruta)
// describe('IpFilterGuard (Opcional)', () => {
//   let app: INestApplication;
//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();
//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });
//   afterAll(async () => {
//     await app.close();
//   });
//   it('deniega acceso a IP en blacklist', async () => {
//     // Suponiendo que tienes la IP 1.2.3.4 en blacklist en tu config
//     return request(app.getHttpServer())
//       .get('/auth/profile')
//       .set('X-Forwarded-For', '1.2.3.4')
//       .expect(403);
//   });
// });

// Opcional: Test para roles (si tienes rutas protegidas por roles)
// describe('RolesGuard (Opcional)', () => {
//   let app: INestApplication;
//   beforeAll(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();
//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });
//   afterAll(async () => {
//     await app.close();
//   });
//   it('deniega acceso a usuario sin rol requerido', async () => {
//     // Suponiendo que tienes un endpoint protegido por Roles('admin')
//     // y el usuario autenticado no es admin
//     // Aquí deberías mockear el token de un usuario sin rol admin
//     // Este test es un placeholder, debes adaptarlo a tu endpoint real
//     return request(app.getHttpServer())
//       .get('/admin-only')
//       .set('Authorization', 'Bearer token-de-usuario-no-admin')
//       .expect(403);
//   });
// });

describe('Additional DTO validations', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new CustomValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should fail if email is invalid in register', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'no-es-email',
        username: `usuario${Date.now()}`,
        password: `Valid123!`, // Updated to match new rule
        passwordConfirmation: `Valid123!`,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'email',
              constraints: expect.objectContaining({
                isEmail: expect.stringContaining('Email must be valid'),
              }),
            }),
          ])
        );
      });
  });

  it('should fail if password is weak', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `test${Date.now()}@example.com`,
        username: `usuario${Date.now()}`,
        password: 'weakpass', // Not valid: no uppercase, number, or special char
        passwordConfirmation: 'weakpass',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'password',
              constraints: expect.objectContaining({
                matches: expect.stringContaining('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character'),
              }),
            }),
          ])
        );
      });
  });

  it('should fail if username is invalid', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `test${Date.now()}@example.com`,
        username: 'usuario con espacios',
        password: `Password${Date.now()}!`,
        passwordConfirmation: `Password${Date.now()}!`,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'username',
              constraints: expect.objectContaining({
                matches: expect.stringContaining('Username can only contain letters, numbers, and underscores'),
              }),
            }),
          ])
        );
      });
  });
}); 