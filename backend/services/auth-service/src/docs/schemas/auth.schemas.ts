import { ApiProperty } from '@nestjs/swagger';

export class AuthUserSchema {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;
  @ApiProperty({ example: 'user@example.com' })
  email: string;
  @ApiProperty({ example: 'user123' })
  username: string;
  @ApiProperty({ example: true })
  isVerified: boolean;
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;
}

export class AuthResponseSchema {
  @ApiProperty({ type: AuthUserSchema })
  user: AuthUserSchema;
  @ApiProperty({ example: 'jwt-access-token' })
  accessToken: string;
  @ApiProperty({ example: 'jwt-refresh-token' })
  refreshToken: string;
  @ApiProperty({ example: 900 })
  expiresIn: number;
}

export class RefreshTokenResponseSchema {
  @ApiProperty({ type: AuthUserSchema })
  user: AuthUserSchema;
  @ApiProperty({ example: 'jwt-access-token' })
  accessToken: string;
  @ApiProperty({ example: 'jwt-refresh-token' })
  refreshToken: string;
  @ApiProperty({ example: 900 })
  expiresIn: number;
}

export class UserProfileSchema {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;
  @ApiProperty({ example: 'user@example.com' })
  email: string;
  @ApiProperty({ example: 'user123' })
  username: string;
  @ApiProperty({ example: true })
  isVerified: boolean;
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;
}

export class ValidateCredentialsResponseSchema {
  @ApiProperty({ example: true })
  valid: boolean;
  @ApiProperty({ type: AuthUserSchema, required: false })
  user?: AuthUserSchema;
}

export class LogoutResponseSchema {
  @ApiProperty({ example: 'Logout successful' })
  message: string;
}

export class ErrorResponseSchema {
  @ApiProperty({ example: 400 })
  statusCode: number;
  @ApiProperty({ example: 'Bad Request' })
  error: string;
  @ApiProperty({ example: 'Error message' })
  message: string | string[];
  @ApiProperty({ example: '/auth/login' })
  path: string;
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  timestamp: string;
}

export class ValidationErrorSchema {
  @ApiProperty({ example: 400 })
  statusCode: number;
  @ApiProperty({ example: ['Email must be valid', 'Password must be at least 8 characters'] })
  message: string[];
  @ApiProperty({ example: 'Bad Request' })
  error: string;
  @ApiProperty({ example: '/auth/register' })
  path: string;
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  timestamp: string;
}

export class RateLimitErrorSchema {
  @ApiProperty({ example: 429 })
  statusCode: number;
  @ApiProperty({ example: 'Too Many Requests' })
  error: string;
  @ApiProperty({ example: 'ThrottlerException: Too Many Requests' })
  message: string;
  @ApiProperty({ example: '/auth/login' })
  path: string;
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  timestamp: string;
} 