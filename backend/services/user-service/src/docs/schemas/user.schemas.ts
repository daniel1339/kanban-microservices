import { ApiProperty } from '@nestjs/swagger';

/**
 * Reusable schemas for User Service documentation
 */

export class UserProfileSchema {
  @ApiProperty({
    description: 'Unique profile ID',
    example: 'profile-123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  id: string;

  @ApiProperty({
    description: 'User ID associated with the profile',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  userId: string;

  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
    type: 'string',
    maxLength: 100,
  })
  displayName: string;

  @ApiProperty({
    description: 'User biography',
    example: 'Senior Full Stack Developer with 5 years of experience',
    type: 'string',
    maxLength: 500,
    required: false,
  })
  bio?: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatars/user-123.png',
    type: 'string',
    required: false,
  })
  avatarUrl?: string;

  @ApiProperty({
    description: 'Profile creation date',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Profile last update date',
    example: '2024-01-20T14:45:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  updated_at: Date;
}

export class UpdateUserProfileSchema {
  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
    type: 'string',
    maxLength: 100,
    required: false,
  })
  displayName?: string;

  @ApiProperty({
    description: 'User biography',
    example: 'Senior Full Stack Developer with 5 years of experience',
    type: 'string',
    maxLength: 500,
    required: false,
  })
  bio?: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatars/user-123.png',
    type: 'string',
    required: false,
  })
  avatarUrl?: string;
}

export class AvatarUploadSchema {
  @ApiProperty({
    description: 'Uploaded avatar URL',
    example: 'https://example.com/avatars/uploaded-avatar.png',
    type: 'string',
  })
  url: string;

  @ApiProperty({
    description: 'Original filename',
    example: 'avatar-123.png',
    type: 'string',
  })
  filename: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024000,
    type: 'number',
  })
  size: number;

  @ApiProperty({
    description: 'File MIME type',
    example: 'image/png',
    type: 'string',
  })
  mimetype: string;

  @ApiProperty({
    description: 'Upload date and time',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  uploadedAt: string;
}

export class UserEventSchema {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    type: 'string',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
    type: 'string',
  })
  username: string;
}

export class ErrorResponseSchema {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
    type: 'number',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Bad Request',
    type: 'string',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
    type: 'string',
  })
  error: string;

  @ApiProperty({
    description: 'Error timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Path where the error occurred',
    example: '/api/users/profile',
    type: 'string',
  })
  path: string;

  @ApiProperty({
    description: 'HTTP method',
    example: 'GET',
    type: 'string',
  })
  method: string;
}

export class ValidationErrorSchema {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
    type: 'number',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
    type: 'string',
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
    type: 'string',
  })
  error: string;

  @ApiProperty({
    description: 'Error timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Path where the error occurred',
    example: '/api/users/profile',
    type: 'string',
  })
  path: string;

  @ApiProperty({
    description: 'HTTP method',
    example: 'PUT',
    type: 'string',
  })
  method: string;

  @ApiProperty({
    description: 'Detailed validation errors',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        field: {
          type: 'string',
          example: 'displayName',
        },
        value: {
          type: 'string',
          example: '',
        },
        constraints: {
          type: 'object',
          example: {
            minLength: 'Display name cannot be empty',
          },
        },
      },
    },
  })
  errors: Array<{
    field: string;
    value: any;
    constraints: Record<string, string>;
  }>;
} 