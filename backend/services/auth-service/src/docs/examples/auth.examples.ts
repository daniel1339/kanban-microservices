import { ApiProperty } from '@nestjs/swagger';

// Request examples for Swagger
export const RegisterRequestExample = {
  summary: 'Successful registration',
  description: 'Example of registration with valid data',
  value: {
    email: 'user@example.com',
    username: 'user123',
    password: 'Valid123!',
    passwordConfirmation: 'Valid123!',
  },
};

export const LoginRequestExample = {
  summary: 'Login with email',
  description: 'Example of login using email',
  value: {
    emailOrUsername: 'user@example.com',
    password: 'Valid123!',
  },
};

export const LoginUsernameRequestExample = {
  summary: 'Login with username',
  description: 'Example of login using username',
  value: {
    emailOrUsername: 'user123',
    password: 'Valid123!',
  },
};

export const RefreshTokenRequestExample = {
  summary: 'Valid refresh token',
  description: 'Example of refresh token to renew access',
  value: {
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  },
};

export const ValidateCredentialsRequestExample = {
  summary: 'Validate credentials',
  description: 'Example of credential validation',
  value: {
    emailOrUsername: 'user@example.com',
    password: 'Password123!',
  },
};

// Response examples for Swagger
export const AuthResponseExample = {
  summary: 'Successful authentication response',
  description: 'Response when login or registration is successful',
  value: {
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      username: 'user123',
      isVerified: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    expiresIn: 900,
  },
};

export const UserProfileResponseExample = {
  summary: 'User profile',
  description: 'Information of the authenticated user profile',
  value: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'user@example.com',
    username: 'user123',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
};

export const ValidateCredentialsResponseExample = {
  summary: 'Credential validation',
  description: 'Credential validation response',
  value: {
    valid: true,
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      username: 'user123',
      isVerified: true,
    },
  },
};

export const LogoutResponseExample = {
  summary: 'Successful logout',
  description: 'Response when logout is successful',
  value: {
    message: 'Logout successful',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const LogoutAllResponseExample = {
  summary: 'Logout all sessions',
  description: 'Response when all user sessions are logged out',
  value: {
    message: 'All sessions logged out successfully',
    sessionsTerminated: 3,
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const InvalidCredentialsResponseExample = {
  summary: 'Invalid credentials',
  description: 'Response when credentials are invalid',
  value: {
    valid: false,
    message: 'Invalid email or password',
  },
};

export const TokenExpiredResponseExample = {
  summary: 'Token expired',
  description: 'Response when JWT token has expired',
  value: {
    message: 'Token has expired',
    error: 'TokenExpiredError',
    expiredAt: '2024-01-01T00:00:00.000Z',
  },
};

export const InvalidTokenResponseExample = {
  summary: 'Invalid token',
  description: 'Response when JWT token is invalid',
  value: {
    message: 'Invalid token',
    error: 'JsonWebTokenError',
    code: 'invalid_token',
  },
};

export const RateLimitExceededResponseExample = {
  summary: 'Rate limit exceeded',
  description: 'Response when rate limit is exceeded',
  value: {
    message: 'Too Many Requests',
    error: 'ThrottlerException',
    retryAfter: 900, // seconds
    limit: 5,
    remaining: 0,
  },
};

export const ValidationErrorResponseExample = {
  summary: 'Validation error',
  description: 'Response when request validation fails with detailed field errors',
  value: {
    statusCode: 400,
    message: 'Validation failed',
    error: 'Bad Request',
    timestamp: '2024-01-01T00:00:00.000Z',
    path: '/api/auth/register',
    errors: [
      {
        field: 'email',
        value: 'invalid-email',
        constraints: {
          isEmail: 'Email must be valid'
        }
      },
      {
        field: 'password',
        value: 'weakpass',
        constraints: {
          matches: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
        }
      }
    ]
  },
};

export const ConflictErrorResponseExample = {
  summary: 'Conflict error',
  description: 'Response when resource already exists',
  value: {
    message: 'User already exists',
    error: 'ConflictException',
    code: 'USER_ALREADY_EXISTS',
    field: 'email',
  },
};

export const ServerErrorResponseExample = {
  summary: 'Server error',
  description: 'Response when internal server error occurs',
  value: {
    message: 'Internal server error',
    error: 'InternalServerErrorException',
    code: 'INTERNAL_SERVER_ERROR',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
}; 