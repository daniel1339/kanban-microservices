/**
 * API Examples for Profile Controller
 */

export const ProfileExamples = {
  // Examples for GET /profile
  getProfile: {
    summary: 'Get authenticated user profile',
    description: 'Returns the complete profile of the authenticated user based on the JWT token',
    request: {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        'Content-Type': 'application/json',
      },
    },
    response: {
      200: {
        description: 'Profile retrieved successfully',
        example: {
          id: 'profile-123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174000',
          displayName: 'John Doe',
          bio: 'Full Stack Developer with 5 years of experience in React, Node.js and TypeScript',
          avatarUrl: 'https://example.com/avatars/john-doe.png',
          created_at: '2024-01-15T10:30:00.000Z',
          updated_at: '2024-01-20T14:45:00.000Z',
        },
      },
      401: {
        description: 'Invalid or expired JWT token',
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/api/users/profile',
        },
      },
      500: {
        description: 'Internal server error',
        example: {
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error',
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/api/users/profile',
        },
      },
    },
  },

  // Examples for PUT /profile
  updateProfile: {
    summary: 'Update authenticated user profile',
    description: 'Updates the authenticated user profile with the provided data',
    request: {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        'Content-Type': 'application/json',
      },
      body: {
        displayName: 'John Doe Updated',
        bio: 'Senior Full Stack Developer with 6 years of experience',
        avatarUrl: 'https://example.com/avatars/john-doe-new.png',
      },
    },
    response: {
      200: {
        description: 'Profile updated successfully',
        example: {
          id: 'profile-123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174000',
          displayName: 'John Doe Updated',
          bio: 'Senior Full Stack Developer with 6 years of experience',
          avatarUrl: 'https://example.com/avatars/john-doe-new.png',
          created_at: '2024-01-15T10:30:00.000Z',
          updated_at: '2024-01-20T15:30:00.000Z',
        },
      },
      400: {
        description: 'Invalid input data',
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
      401: {
        description: 'Invalid or expired JWT token',
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/api/users/profile',
        },
      },
      500: {
        description: 'Internal server error',
        example: {
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error',
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/api/users/profile',
        },
      },
    },
  },

  // Partial update examples
  partialUpdate: {
    summary: 'Partial profile update',
    description: 'Examples of updating specific profile fields',
    examples: {
      onlyDisplayName: {
        request: {
          displayName: 'Jane Smith',
        },
        response: {
          id: 'profile-123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174000',
          displayName: 'Jane Smith',
          bio: 'Full Stack Developer with 5 years of experience',
          avatarUrl: 'https://example.com/avatars/john-doe.png',
          created_at: '2024-01-15T10:30:00.000Z',
          updated_at: '2024-01-20T16:00:00.000Z',
        },
      },
      onlyBio: {
        request: {
          bio: 'Updated biography',
        },
        response: {
          id: 'profile-123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174000',
          displayName: 'John Doe',
          bio: 'Updated biography',
          avatarUrl: 'https://example.com/avatars/john-doe.png',
          created_at: '2024-01-15T10:30:00.000Z',
          updated_at: '2024-01-20T16:15:00.000Z',
        },
      },
      onlyAvatarUrl: {
        request: {
          avatarUrl: 'https://example.com/avatars/new-avatar.png',
        },
        response: {
          id: 'profile-123e4567-e89b-12d3-a456-426614174000',
          userId: '123e4567-e89b-12d3-a456-426614174000',
          displayName: 'John Doe',
          bio: 'Full Stack Developer with 5 years of experience',
          avatarUrl: 'https://example.com/avatars/new-avatar.png',
          created_at: '2024-01-15T10:30:00.000Z',
          updated_at: '2024-01-20T16:30:00.000Z',
        },
      },
    },
  },

  // Specific error cases
  errorCases: {
    invalidToken: {
      description: 'Invalid JWT token',
      request: {
        headers: {
          'Authorization': 'Bearer invalid-token',
        },
      },
      response: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
        timestamp: '2024-01-15T10:30:00.000Z',
        path: '/api/users/profile',
      },
    },
    expiredToken: {
      description: 'Expired JWT token',
      request: {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired.token',
        },
      },
      response: {
        statusCode: 401,
        message: 'Token expired',
        error: 'Unauthorized',
        timestamp: '2024-01-15T10:30:00.000Z',
        path: '/api/users/profile',
      },
    },
    missingToken: {
      description: 'Missing JWT token',
      request: {
        headers: {},
      },
      response: {
        statusCode: 401,
        message: 'No token provided',
        error: 'Unauthorized',
        timestamp: '2024-01-15T10:30:00.000Z',
        path: '/api/users/profile',
      },
    },
    validationErrors: {
      description: 'Input data validation errors',
      request: {
        body: {
          displayName: '', // Empty field
          bio: 123, // Wrong type
          avatarUrl: 'not-a-url', // Invalid URL
        },
      },
      response: {
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
  },
}; 