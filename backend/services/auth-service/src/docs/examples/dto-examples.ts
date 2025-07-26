import { ApiProperty } from '@nestjs/swagger';

// Examples for RegisterDto
export class RegisterDtoExample {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Valid user email',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
  })
  email: string;

  @ApiProperty({
    example: 'user123',
    description: 'Unique username (3-100 characters, only letters, numbers and underscores)',
    minLength: 3,
    maxLength: 100,
    pattern: '^[a-zA-Z0-9_]+$',
  })
  username: string;

  @ApiProperty({
    example: 'Valid123!',
    description: 'Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.',
    minLength: 8,
    maxLength: 255,
  })
  password: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password confirmation (must match password)',
  })
  passwordConfirmation: string;
}

// Examples for LoginDto
export class LoginDtoExample {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email or username',
    oneOf: [
      { type: 'string', format: 'email' },
      { type: 'string', pattern: '^[a-zA-Z0-9_]+$' },
    ],
  })
  emailOrUsername: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password',
  })
  password: string;
}

// Examples for RefreshTokenDto
export class RefreshTokenDtoExample {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Valid refresh token to renew access token',
  })
  refreshToken: string;
}

// Successful response examples
export class AuthResponseExample {
  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      username: 'user123',
      isVerified: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    description: 'User information',
  })
  user: any;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'JWT access token for authentication',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Refresh token to renew access token',
  })
  refreshToken: string;

  @ApiProperty({
    example: 900,
    description: 'Access token expiration time in seconds',
  })
  expiresIn: number;
}

// Error response examples
export class ErrorResponseExample {
  @ApiProperty({
    example: 'ValidationError',
    description: 'Error type',
  })
  error: string;

  @ApiProperty({
    example: 400,
    description: 'HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    example: ['Email must be valid', 'Password must be at least 8 characters'],
    description: 'List of validation errors',
  })
  message: string[];

  @ApiProperty({
    example: '/auth/register',
    description: 'Endpoint where the error occurred',
  })
  path: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Error timestamp',
  })
  timestamp: string;
}

// Password validation examples
export class PasswordValidationExample {
  @ApiProperty({
    example: 'Valid123!',
    description: 'Valid password that meets all requirements',
  })
  validPassword: string;

  @ApiProperty({
    example: 'weakpass',
    description: 'Invalid password (missing uppercase, number, and special character)',
  })
  invalidWeakPassword: string;

  @ApiProperty({
    example: '123',
    description: 'Invalid password (too short)',
  })
  invalidShortPassword: string;

  @ApiProperty({
    example: 'onlyletters',
    description: 'Invalid password (only lowercase letters)',
  })
  invalidOnlyLettersPassword: string;
}

// Rate limit headers examples
export class RateLimitHeadersExample {
  @ApiProperty({
    example: 'X-RateLimit-Limit: 5',
    description: 'Maximum number of requests allowed',
  })
  limit: string;

  @ApiProperty({
    example: 'X-RateLimit-Remaining: 3',
    description: 'Number of requests remaining',
  })
  remaining: string;

  @ApiProperty({
    example: 'X-RateLimit-Reset: 1640995200',
    description: 'Timestamp when rate limit resets',
  })
  reset: string;

  @ApiProperty({
    example: 'Retry-After: 900',
    description: 'Seconds to wait before retrying',
  })
  retryAfter: string;
}

// Security headers examples
export class SecurityHeadersExample {
  @ApiProperty({
    example: 'X-Content-Type-Options: nosniff',
    description: 'Prevents MIME type sniffing',
  })
  contentTypeOptions: string;

  @ApiProperty({
    example: 'X-Frame-Options: DENY',
    description: 'Prevents clickjacking attacks',
  })
  frameOptions: string;

  @ApiProperty({
    example: 'X-XSS-Protection: 1; mode=block',
    description: 'Enables XSS protection',
  })
  xssProtection: string;

  @ApiProperty({
    example: 'Strict-Transport-Security: max-age=31536000; includeSubDomains',
    description: 'Enforces HTTPS',
  })
  hsts: string;
} 