// Error examples for Swagger (Auth Service)

export const ValidationErrorExample = {
  summary: 'Validation error',
  description: 'Error when data does not meet validations. The message field can be an array of strings with specific errors.',
  value: {
    statusCode: 400,
    message: [
      'Email must be valid',
      'Username must be at least 3 characters',
      'Password must be at least 8 characters',
      'Password must contain at least one uppercase letter',
      'Password must contain at least one number',
      'Password must contain at least one symbol',
      'Password cannot be a common password',
    ],
    error: 'Bad Request',
    path: '/auth/register',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const UnauthorizedErrorExample = {
  summary: 'Unauthorized',
  description: 'Error when credentials are invalid or token is incorrect.',
  value: {
    statusCode: 401,
    message: 'Invalid credentials',
    error: 'Unauthorized',
    path: '/auth/login',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const ConflictErrorExample = {
  summary: 'Conflict',
  description: 'Error when email or username already exists.',
  value: {
    statusCode: 409,
    message: 'Email already registered',
    error: 'Conflict',
    path: '/auth/register',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const InvalidTokenErrorExample = {
  summary: 'Invalid token',
  description: 'Error when refresh token is invalid or expired.',
  value: {
    statusCode: 401,
    message: 'Invalid refresh token',
    error: 'Unauthorized',
    path: '/auth/refresh',
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
    path: '/auth/login',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const NotFoundErrorExample = {
  summary: 'Not found',
  description: 'Error when the requested resource does not exist.',
  value: {
    statusCode: 404,
    message: 'User not found',
    error: 'Not Found',
    path: '/auth/profile',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const ForbiddenErrorExample = {
  summary: 'Forbidden',
  description: 'Error when user does not have permissions to access the resource.',
  value: {
    statusCode: 403,
    message: 'You do not have permissions to access this resource',
    error: 'Forbidden',
    path: '/auth/admin',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const InternalServerErrorExample = {
  summary: 'Internal server error',
  description: 'Unexpected server error.',
  value: {
    statusCode: 500,
    message: 'Internal server error',
    error: 'Internal Server Error',
    path: '/auth/login',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
}; 