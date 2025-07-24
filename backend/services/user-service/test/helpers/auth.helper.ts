import * as request from 'supertest';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export class AuthHelper {
  private static readonly AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

  /**
   * Registers a user and gets real JWT tokens
   */
  static async registerAndGetTokens(
    email: string = 'test@example.com',
    username: string = 'testuser',
    password: string = 'TestPassword123!'
  ): Promise<AuthTokens> {
    const registerData = {
      email,
      username,
      password,
      passwordConfirmation: password,
    };

    const response = await request(this.AUTH_SERVICE_URL)
      .post('/auth/register')
      .send(registerData)
      .expect(201);

    return {
      accessToken: response.body.accessToken,
      refreshToken: response.body.refreshToken,
      user: response.body.user,
    };
  }

  /**
   * Logs in and gets real JWT tokens
   */
  static async loginAndGetTokens(
    emailOrUsername: string = 'test@example.com',
    password: string = 'TestPassword123!'
  ): Promise<AuthTokens> {
    const loginData = {
      emailOrUsername,
      password,
    };

    const response = await request(this.AUTH_SERVICE_URL)
      .post('/auth/login')
      .send(loginData)
      .expect(200);

    return {
      accessToken: response.body.accessToken,
      refreshToken: response.body.refreshToken,
      user: response.body.user,
    };
  }

  /**
   * Refreshes a token using the refresh token
   */
  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await request(this.AUTH_SERVICE_URL)
      .post('/auth/refresh')
      .send({ refreshToken })
      .expect(200);

    return {
      accessToken: response.body.accessToken,
      refreshToken: response.body.refreshToken,
      user: response.body.user,
    };
  }

  /**
   * Validates a JWT token
   */
  static async validateToken(accessToken: string): Promise<boolean> {
    try {
      await request(this.AUTH_SERVICE_URL)
        .get('/auth/validate')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Creates a test user and returns their tokens
   */
  static async createTestUser(): Promise<AuthTokens> {
    const timestamp = Date.now();
    const email = `test-${timestamp}@example.com`;
    const username = `testuser-${timestamp}`;
    
    return this.registerAndGetTokens(email, username, 'TestPassword123!');
  }

  /**
   * Cleans up a test user (logout)
   */
  static async cleanupTestUser(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await request(this.AUTH_SERVICE_URL)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(200);
    } catch (error) {
      // Ignore cleanup errors
    }
  }
} 