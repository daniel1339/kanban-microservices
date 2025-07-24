import { ApiResponse } from '@nestjs/swagger';
import { UserProfileSchema, AvatarUploadSchema, ErrorResponseSchema, ValidationErrorSchema } from '../schemas/user.schemas';

/**
 * Typed responses for User Service documentation
 */

export const GetProfileResponse = ApiResponse({
  status: 200,
  description: 'User profile retrieved successfully',
  type: UserProfileSchema,
  schema: {
    example: {
      id: 'profile-123e4567-e89b-12d3-a456-426614174000',
      userId: '123e4567-e89b-12d3-a456-426614174000',
      displayName: 'John Doe',
      bio: 'Senior Full Stack Developer with 5 years of experience',
      avatarUrl: 'https://example.com/avatars/user-123.png',
      created_at: '2024-01-15T10:30:00.000Z',
      updated_at: '2024-01-20T14:45:00.000Z',
    },
  },
});

export const UpdateProfileResponse = ApiResponse({
  status: 200,
  description: 'User profile updated successfully',
  type: UserProfileSchema,
  schema: {
    example: {
      id: 'profile-123e4567-e89b-12d3-a456-426614174000',
      userId: '123e4567-e89b-12d3-a456-426614174000',
      displayName: 'John Doe Updated',
      bio: 'Senior Full Stack Developer with 6 years of experience',
      avatarUrl: 'https://example.com/avatars/user-123.png',
      created_at: '2024-01-15T10:30:00.000Z',
      updated_at: '2024-01-20T15:30:00.000Z',
    },
  },
});

export const GetUserByIdResponse = ApiResponse({
  status: 200,
  description: 'Public user profile retrieved successfully',
  type: UserProfileSchema,
  schema: {
    example: {
      id: 'profile-123e4567-e89b-12d3-a456-426614174000',
      userId: '123e4567-e89b-12d3-a456-426614174000',
      displayName: 'John Doe',
      bio: 'Senior Full Stack Developer with 5 years of experience',
      avatarUrl: 'https://example.com/avatars/user-123.png',
      created_at: '2024-01-15T10:30:00.000Z',
      updated_at: '2024-01-20T14:45:00.000Z',
    },
  },
});

export const UploadAvatarResponse = ApiResponse({
  status: 201,
  description: 'Avatar uploaded successfully',
  type: AvatarUploadSchema,
  schema: {
    example: {
      url: 'https://example.com/avatars/uploaded-avatar.png',
      filename: 'avatar-123.png',
      size: 1024000,
      mimetype: 'image/png',
      uploadedAt: '2024-01-15T10:30:00.000Z',
    },
  },
});

export const UnauthorizedResponse = ApiResponse({
  status: 401,
  description: 'Unauthorized - Invalid or expired JWT token',
  type: ErrorResponseSchema,
  schema: {
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
    },
  },
});

export const ForbiddenResponse = ApiResponse({
  status: 403,
  description: 'Forbidden - You do not have permission to access this resource',
  type: ErrorResponseSchema,
  schema: {
    example: {
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
    },
  },
});

export const NotFoundResponse = ApiResponse({
  status: 404,
  description: 'Not found - User or profile does not exist',
  type: ErrorResponseSchema,
  schema: {
    example: {
      statusCode: 404,
      message: 'User not found',
      error: 'Not Found',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/123e4567-e89b-12d3-a456-426614174000',
    },
  },
});

export const BadRequestResponse = ApiResponse({
  status: 400,
  description: 'Bad request - Invalid input data',
  type: ValidationErrorSchema,
  schema: {
    example: {
      statusCode: 400,
      message: 'Validation failed',
      errors: [
        'displayName should not be empty',
        'bio must be a string',
        'avatarUrl must be a valid URL',
      ],
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
    },
  },
});

export const FileTooLargeResponse = ApiResponse({
  status: 413,
  description: 'File too large - File size exceeds the allowed limit',
  type: ErrorResponseSchema,
  schema: {
    example: {
      statusCode: 413,
      message: 'File too large',
      error: 'Payload Too Large',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/avatar/upload',
    },
  },
});

export const UnsupportedMediaTypeResponse = ApiResponse({
  status: 415,
  description: 'Unsupported media type - File format is not allowed',
  type: ErrorResponseSchema,
  schema: {
    example: {
      statusCode: 415,
      message: 'Unsupported media type',
      error: 'Unsupported Media Type',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/avatar/upload',
    },
  },
});

export const InternalServerErrorResponse = ApiResponse({
  status: 500,
  description: 'Internal server error',
  type: ErrorResponseSchema,
  schema: {
    example: {
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
    },
  },
}); 