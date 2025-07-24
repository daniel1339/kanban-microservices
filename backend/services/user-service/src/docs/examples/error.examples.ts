/**
 * Detailed error examples for User Service documentation
 */

export const ErrorExamples = {
  // Authentication errors
  authentication: {
    unauthorized: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'Invalid or expired JWT token',
      solution: 'Get a new token from the Auth Service',
    },
    tokenExpired: {
      statusCode: 401,
      message: 'Token expired',
      error: 'Unauthorized',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'The JWT token has expired',
      solution: 'Renew your authentication token',
    },
    noToken: {
      statusCode: 401,
      message: 'No token provided',
      error: 'Unauthorized',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'No authorization token provided',
      solution: 'Include the Authorization header: Bearer <token>',
    },
    invalidToken: {
      statusCode: 401,
      message: 'Invalid token format',
      error: 'Unauthorized',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'Invalid token format',
      solution: 'Use the correct format: Bearer <jwt-token>',
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
      details: 'You do not have permission to access this resource',
      solution: 'Verify that your token has the necessary permissions',
    },
    insufficientPermissions: {
      statusCode: 403,
      message: 'Insufficient permissions',
      error: 'Forbidden',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'Your token does not have the required permissions',
      solution: 'Contact the administrator to get additional permissions',
    },
  },

  // Validation errors
  validation: {
    badRequest: {
      statusCode: 400,
      message: 'Validation failed',
      errors: [
        'displayName should not be empty',
        'bio must be a string',
        'avatarUrl must be a valid URL',
      ],
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'Input data does not meet validation requirements',
      solution: 'Correct validation errors and try again',
    },
    invalidDisplayName: {
      statusCode: 400,
      message: 'Validation failed',
      errors: [
        'displayName should not be empty',
        'displayName must be between 1 and 100 characters',
      ],
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'Display name does not meet requirements',
      solution: 'Provide a valid name between 1 and 100 characters',
    },
    invalidBio: {
      statusCode: 400,
      message: 'Validation failed',
      errors: [
        'bio must be a string',
        'bio must be between 0 and 500 characters',
      ],
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'Bio does not meet requirements',
      solution: 'Provide a valid bio of maximum 500 characters',
    },
    invalidAvatarUrl: {
      statusCode: 400,
      message: 'Validation failed',
      errors: [
        'avatarUrl must be a valid URL',
        'avatarUrl must be a valid image URL',
      ],
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'Avatar URL is not valid',
      solution: 'Provide a valid image URL (PNG, JPG, JPEG, GIF)',
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
      details: 'File exceeds maximum allowed size (5MB)',
      solution: 'Compress the image or use a lower resolution',
    },
    unsupportedMediaType: {
      statusCode: 415,
      message: 'Unsupported media type',
      error: 'Unsupported Media Type',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/avatar/upload',
      details: 'File type is not supported',
      solution: 'Use supported formats: PNG, JPG, JPEG, GIF',
    },
    noFileProvided: {
      statusCode: 400,
      message: 'No file provided',
      error: 'Bad Request',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/avatar/upload',
      details: 'No file was provided',
      solution: 'Include a file in the multipart/form-data request',
    },
    fileUploadFailed: {
      statusCode: 500,
      message: 'File upload failed',
      error: 'Internal Server Error',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/avatar/upload',
      details: 'Internal error during file upload',
      solution: 'Try again or contact technical support',
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
      details: 'The specified user does not exist',
      solution: 'Verify the user ID or contact the administrator',
    },
    profileNotFound: {
      statusCode: 404,
      message: 'Profile not found',
      error: 'Not Found',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/profile',
      details: 'The user profile does not exist',
      solution: 'Create a profile for the user or contact the administrator',
    },
    avatarNotFound: {
      statusCode: 404,
      message: 'Avatar not found',
      error: 'Not Found',
      timestamp: '2024-01-15T10:30:00.000Z',
      path: '/api/users/avatar/123',
      details: 'The specified avatar does not exist',
      solution: 'Verify the avatar URL or upload a new image',
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
