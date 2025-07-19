import { ApiProperty } from '@nestjs/swagger';

// Ejemplos de requests para Swagger
export const RegisterRequestExample = {
  summary: 'Registro exitoso',
  description: 'Ejemplo de registro con datos válidos',
  value: {
    email: 'usuario@ejemplo.com',
    username: 'usuario123',
    password: 'Contraseña123!',
    passwordConfirmation: 'Contraseña123!',
  },
};

export const LoginRequestExample = {
  summary: 'Login con email',
  description: 'Ejemplo de login usando email',
  value: {
    emailOrUsername: 'usuario@ejemplo.com',
    password: 'Contraseña123!',
  },
};

export const LoginUsernameRequestExample = {
  summary: 'Login con username',
  description: 'Ejemplo de login usando username',
  value: {
    emailOrUsername: 'usuario123',
    password: 'Contraseña123!',
  },
};

export const RefreshTokenRequestExample = {
  summary: 'Refresh token válido',
  description: 'Ejemplo de refresh token para renovar acceso',
  value: {
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  },
};

export const ValidateCredentialsRequestExample = {
  summary: 'Validar credenciales',
  description: 'Ejemplo de validación de credenciales',
  value: {
    emailOrUsername: 'usuario@ejemplo.com',
    password: 'Contraseña123!',
  },
};

// Ejemplos de responses para Swagger
export const AuthResponseExample = {
  summary: 'Respuesta de autenticación exitosa',
  description: 'Respuesta cuando el login o registro es exitoso',
  value: {
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'usuario@ejemplo.com',
      username: 'usuario123',
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
  summary: 'Perfil de usuario',
  description: 'Información del perfil del usuario autenticado',
  value: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'usuario@ejemplo.com',
    username: 'usuario123',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
};

export const ValidateCredentialsResponseExample = {
  summary: 'Validación de credenciales',
  description: 'Respuesta de validación de credenciales',
  value: {
    valid: true,
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'usuario@ejemplo.com',
      username: 'usuario123',
      isVerified: true,
    },
  },
};

export const LogoutResponseExample = {
  summary: 'Logout exitoso',
  description: 'Respuesta cuando el logout es exitoso',
  value: {
    message: 'Logout successful',
  },
};

export const LogoutAllResponseExample = {
  summary: 'Logout de todas las sesiones',
  description: 'Respuesta cuando se cierran todas las sesiones',
  value: {
    message: 'All sessions logged out successfully',
  },
};

// Ejemplos de errores para Swagger
export const ValidationErrorExample = {
  summary: 'Error de validación',
  description: 'Error cuando los datos no cumplen las validaciones',
  value: {
    statusCode: 400,
    message: [
      'El email debe ser válido',
      'El username debe tener al menos 3 caracteres',
      'La contraseña debe tener al menos 8 caracteres',
      'La contraseña debe contener al menos una letra mayúscula',
      'La contraseña debe contener al menos un número',
      'La contraseña debe contener al menos un símbolo',
      'La contraseña no puede ser una contraseña común',
    ],
    error: 'Bad Request',
    path: '/auth/register',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const UnauthorizedErrorExample = {
  summary: 'No autorizado',
  description: 'Error cuando las credenciales son inválidas',
  value: {
    statusCode: 401,
    message: 'Credenciales inválidas',
    error: 'Unauthorized',
    path: '/auth/login',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const ConflictErrorExample = {
  summary: 'Conflicto',
  description: 'Error cuando el email o username ya existe',
  value: {
    statusCode: 409,
    message: 'El email ya está registrado',
    error: 'Conflict',
    path: '/auth/register',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const InvalidTokenErrorExample = {
  summary: 'Token inválido',
  description: 'Error cuando el refresh token es inválido',
  value: {
    statusCode: 401,
    message: 'Refresh token inválido',
    error: 'Unauthorized',
    path: '/auth/refresh',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const RateLimitErrorExample = {
  summary: 'Rate limit excedido',
  description: 'Error cuando se excede el límite de requests',
  value: {
    statusCode: 429,
    message: 'ThrottlerException: Too Many Requests',
    error: 'Too Many Requests',
    path: '/auth/login',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const NotFoundErrorExample = {
  summary: 'No encontrado',
  description: 'Error cuando el recurso no existe',
  value: {
    statusCode: 404,
    message: 'Usuario no encontrado',
    error: 'Not Found',
    path: '/auth/profile',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const ForbiddenErrorExample = {
  summary: 'Prohibido',
  description: 'Error cuando no se tienen permisos',
  value: {
    statusCode: 403,
    message: 'No tienes permisos para acceder a este recurso',
    error: 'Forbidden',
    path: '/auth/admin',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

export const InternalServerErrorExample = {
  summary: 'Error interno del servidor',
  description: 'Error cuando ocurre un problema interno',
  value: {
    statusCode: 500,
    message: 'Internal server error',
    error: 'Internal Server Error',
    path: '/auth/register',
    timestamp: '2024-01-01T00:00:00.000Z',
  },
};

// Ejemplos de headers para Swagger
export const RateLimitHeadersExample = {
  'x-ratelimit-limit': '5',
  'x-ratelimit-remaining': '3',
  'x-ratelimit-reset': '1640995200',
};

export const SecurityHeadersExample = {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  'Content-Type': 'application/json',
  'X-API-Key': 'X-API-Key-12345',
};

// Ejemplos de códigos de estado HTTP
export const HttpStatusExamples = {
  200: 'OK - Operación exitosa',
  201: 'Created - Recurso creado exitosamente',
  400: 'Bad Request - Datos inválidos',
  401: 'Unauthorized - No autorizado',
  403: 'Forbidden - Sin permisos',
  404: 'Not Found - Recurso no encontrado',
  409: 'Conflict - Recurso ya existe',
  422: 'Unprocessable Entity - Validación fallida',
  429: 'Too Many Requests - Rate limit excedido',
  500: 'Internal Server Error - Error del servidor',
}; 