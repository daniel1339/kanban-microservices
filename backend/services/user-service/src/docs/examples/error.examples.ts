// Error examples for Swagger (User Service)

export const ValidationErrorExample = {
  summary: 'Validation error',
  description: 'Error when data does not meet validations. The response includes specific field errors with details.',
  value: {
    statusCode: 400,
    message: "Validation failed",
    error: 'Bad Request',
    path: '/api/users/profile',
    method: 'PUT',
    timestamp: '2024-01-01T00:00:00.000Z',
    errors: [
      {
        field: 'displayName',
        value: '',
        constraints: {
          minLength: 'Display name cannot be empty'
        }
      },
      {
        field: 'bio',
        value: 123,
        constraints: {
          isString: 'Biography must be a string'
        }
      },
      {
        field: 'avatarUrl',
        value: 'invalid-url',
        constraints: {
          isUrl: 'Avatar URL must be a valid URL'
        }
      }
    ]
  },
};

export const UnauthorizedErrorExample = {
  summary: 'Unauthorized',
  description: 'Error when credentials are invalid or token is incorrect.',
  value: {
    statusCode: 401,
    message: 'Unauthorized',
    error: 'Unauthorized',
    path: '/api/users/profile',
    method: 'GET',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const NotFoundErrorExample = {
  summary: 'Not found',
  description: 'Error when the requested user does not exist.',
  value: {
    statusCode: 404,
    message: 'User not found',
    error: 'Not Found',
    path: '/api/users/123e4567-e89b-12d3-a456-426614174000',
    method: 'GET',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const FileTooLargeErrorExample = {
  summary: 'File too large',
  description: 'Error when uploaded file exceeds the maximum allowed size.',
  value: {
    statusCode: 413,
    message: 'File too large',
    error: 'Payload Too Large',
    path: '/api/users/avatar/upload',
    method: 'POST',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const UnsupportedMediaTypeErrorExample = {
  summary: 'Unsupported media type',
  description: 'Error when uploaded file type is not supported.',
  value: {
    statusCode: 415,
    message: 'Unsupported media type',
    error: 'Unsupported Media Type',
    path: '/api/users/avatar/upload',
    method: 'POST',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const RateLimitErrorExample = {
  summary: 'Rate limit exceeded',
  description: 'Error when the allowed request limit is exceeded.',
  value: {
    statusCode: 429,
    message: 'ThrottlerException: Too Many Requests',
    error: 'Too Many Requests',
    path: '/api/users/profile',
    method: 'PUT',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const InternalServerErrorExample = {
  summary: 'Internal server error',
  description: 'Error when an unexpected server error occurs.',
  value: {
    statusCode: 500,
    message: 'Internal server error',
    error: 'Internal Server Error',
    path: '/api/users/avatar/upload',
    method: 'POST',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

// Legacy error examples for backward compatibility
export const ErrorExamples = {
  // Authentication errors
  authentication: {
    unauthorized: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      method: 'GET',
    },
    tokenExpired: {
      statusCode: 401,
      message: 'Token expired',
      error: 'Unauthorized',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      method: 'GET',
    },
    noToken: {
      statusCode: 401,
      message: 'No token provided',
      error: 'Unauthorized',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      method: 'GET',
    },
    invalidToken: {
      statusCode: 401,
      message: 'Invalid token format',
      error: 'Unauthorized',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      method: 'GET',
    },
  },

  // Authorization errors
  authorization: {
    forbidden: {
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      method: 'GET',
    },
    insufficientPermissions: {
      statusCode: 403,
      message: 'Insufficient permissions',
      error: 'Forbidden',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      method: 'GET',
    },
  },

  // Validation errors
  validation: {
    badRequest: {
      statusCode: 400,
      message: 'Validation failed',
      error: 'Bad Request',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      method: 'PUT',
      errors: [
        {
          field: 'displayName',
          value: '',
          constraints: {
            minLength: 'Display name cannot be empty'
          }
        },
        {
          field: 'bio',
          value: 123,
          constraints: {
            isString: 'Biography must be a string'
          }
        },
        {
          field: 'avatarUrl',
          value: 'invalid-url',
          constraints: {
            isUrl: 'Avatar URL must be a valid URL'
          }
        }
      ]
    },
    invalidDisplayName: {
      statusCode: 400,
      message: 'Validation failed',
      error: 'Bad Request',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      method: 'PUT',
      errors: [
        {
          field: 'displayName',
          value: '',
          constraints: {
            minLength: 'Display name cannot be empty'
          }
        },
        {
          field: 'displayName',
          value: 'a'.repeat(101),
          constraints: {
            maxLength: 'Display name cannot exceed 100 characters'
          }
        }
      ]
    },
    invalidBio: {
      statusCode: 400,
      message: 'Validation failed',
      error: 'Bad Request',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      method: 'PUT',
      errors: [
        {
          field: 'bio',
          value: 123,
          constraints: {
            isString: 'Biography must be a string'
          }
        },
        {
          field: 'bio',
          value: 'a'.repeat(1001),
          constraints: {
            maxLength: 'Biography cannot exceed 1000 characters'
          }
        }
      ]
    },
    invalidAvatarUrl: {
      statusCode: 400,
      message: 'Validation failed',
      error: 'Bad Request',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      method: 'PUT',
      errors: [
        {
          field: 'avatarUrl',
          value: 'invalid-url',
          constraints: {
            isUrl: 'Avatar URL must be a valid URL'
          }
        },
        {
          field: 'avatarUrl',
          value: 'https://example.com/file.txt',
          constraints: {
            isImageUrl: 'Avatar URL must be a valid image URL'
          }
        }
      ]
    },
  },

  // File upload errors
  fileUpload: {
    fileTooLarge: {
      statusCode: 413,
      message: 'File too large',
      error: 'Payload Too Large',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/avatar/upload',
      method: 'POST',
    },
    unsupportedMediaType: {
      statusCode: 415,
      message: 'Unsupported media type',
      error: 'Unsupported Media Type',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/avatar/upload',
      method: 'POST',
    },
    noFileProvided: {
      statusCode: 400,
      message: 'No file provided',
      error: 'Bad Request',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/avatar/upload',
      method: 'POST',
    },
    fileUploadFailed: {
      statusCode: 500,
      message: 'File upload failed',
      error: 'Internal Server Error',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/avatar/upload',
      method: 'POST',
    },
  },

  // Resource not found errors
  notFound: {
    userNotFound: {
      statusCode: 404,
      message: 'User not found',
      error: 'Not Found',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/123e4567-e89b-12d3-a456-426614174000',
      method: 'GET',
    },
    profileNotFound: {
      statusCode: 404,
      message: 'Profile not found',
      error: 'Not Found',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      method: 'GET',
    },
    avatarNotFound: {
      statusCode: 404,
      message: 'Avatar not found',
      error: 'Not Found',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/avatar/123',
      method: 'GET',
    },
  },

  // Server errors
  server: {
    internalServerError: {
      statusCode: 500,
      message: 'Internal server error',
      error: 'Internal Server Error',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'Internal server error',
      solution: 'Contact technical support with error details',
    },
    databaseError: {
      statusCode: 500,
      message: 'Database connection error',
      error: 'Internal Server Error',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'Database connection error',
      solution: 'The service will recover automatically, try again',
    },
    serviceUnavailable: {
      statusCode: 503,
      message: 'Service temporarily unavailable',
      error: 'Service Unavailable',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'The service is temporarily unavailable',
      solution: 'Try again in a few minutes',
    },
  },

  // Rate limiting errors
  rateLimit: {
    tooManyRequests: {
      statusCode: 429,
      message: 'Too many requests',
      error: 'Too Many Requests',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'You have exceeded the requests per minute limit',
      solution: 'Wait a minute before making more requests',
    },
    rateLimitExceeded: {
      statusCode: 429,
      message: 'Rate limit exceeded',
      error: 'Too Many Requests',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/avatar/upload',
      details: 'You have exceeded the file upload limit',
      solution: 'Wait 5 minutes before uploading more files',
    },
  },

  // Integration errors
  integration: {
    authServiceUnavailable: {
      statusCode: 502,
      message: 'Auth service unavailable',
      error: 'Bad Gateway',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'The Auth Service is not available',
      solution: 'The service will recover automatically',
    },
    eventProcessingError: {
      statusCode: 500,
      message: 'Event processing error',
      error: 'Internal Server Error',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'Error processing Auth Service events',
      solution: 'Data will synchronize automatically',
    },
  },
};

/**
 * HTTP status codes and their descriptions
 */
export const HttpStatusCodes = {
  200: 'OK - Successful operation',
  201: 'Created - Resource created successfully',
  400: 'Bad Request - Incorrect request',
  401: 'Unauthorized - Not authorized',
  403: 'Forbidden - Forbidden',
  404: 'Not Found - Not found',
  413: 'Payload Too Large - File too large',
  415: 'Unsupported Media Type - Unsupported media type',
  429: 'Too Many Requests - Too many requests',
  500: 'Internal Server Error - Internal server error',
  502: 'Bad Gateway - Gateway error',
  503: 'Service Unavailable - Service unavailable',
};

/**
 * Common solutions for errors
 */
export const CommonSolutions = {
  authentication: [
    'Verify that your JWT token is valid',
    'Renew your token if it has expired',
    'Make sure to include the Authorization header: Bearer <token>',
    'Contact the Auth Service to get a new token',
  ],
  validation: [
    'Review validation errors in the response',
    'Make sure all required fields are present',
    'Verify that data types are correct',
    'Check that URLs are valid',
  ],
  fileUpload: [
    'Verify that the file does not exceed 5MB',
    'Use supported formats: PNG, JPG, JPEG, GIF',
    'Compress the image if necessary',
    'Make sure the file is not corrupted',
  ],
  rateLimit: [
    'Wait before making more requests',
    'Implement retry with exponential backoff',
    'Consider using cache to reduce requests',
    'Contact the team if you need higher limits',
  ],
};
