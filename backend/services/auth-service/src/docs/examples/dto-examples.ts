import { ApiProperty } from '@nestjs/swagger';

// Ejemplos para RegisterDto
export class RegisterDtoExample {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Email válido del usuario',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
  })
  email: string;

  @ApiProperty({
    example: 'usuario123',
    description: 'Nombre de usuario único (3-100 caracteres, solo letras, números y guiones bajos)',
    minLength: 3,
    maxLength: 100,
    pattern: '^[a-zA-Z0-9_]+$',
  })
  username: string;

  @ApiProperty({
    example: 'Contraseña123!',
    description: 'Contraseña segura (mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos)',
    minLength: 8,
    maxLength: 255,
  })
  password: string;

  @ApiProperty({
    example: 'Contraseña123!',
    description: 'Confirmación de la contraseña (debe coincidir con password)',
  })
  passwordConfirmation: string;
}

// Ejemplos para LoginDto
export class LoginDtoExample {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Email o nombre de usuario del usuario',
    oneOf: [
      { type: 'string', format: 'email' },
      { type: 'string', pattern: '^[a-zA-Z0-9_]+$' },
    ],
  })
  emailOrUsername: string;

  @ApiProperty({
    example: 'Contraseña123!',
    description: 'Contraseña del usuario',
  })
  password: string;
}

// Ejemplos para RefreshTokenDto
export class RefreshTokenDtoExample {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Refresh token válido para renovar el access token',
  })
  refreshToken: string;
}

// Ejemplos de respuestas exitosas
export class AuthResponseExample {
  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'usuario@ejemplo.com',
      username: 'usuario123',
      isVerified: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    description: 'Información del usuario',
  })
  user: any;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'JWT access token para autenticación',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Refresh token para renovar el access token',
  })
  refreshToken: string;

  @ApiProperty({
    example: 900,
    description: 'Tiempo de expiración del access token en segundos',
  })
  expiresIn: number;
}

// Ejemplos de respuestas de error
export class ErrorResponseExample {
  @ApiProperty({
    example: 'Bad Request',
    description: 'Tipo de error',
  })
  error: string;

  @ApiProperty({
    example: 400,
    description: 'Código de estado HTTP',
  })
  statusCode: number;

  @ApiProperty({
    example: ['El email debe ser válido', 'La contraseña debe tener al menos 8 caracteres'],
    description: 'Lista de errores de validación',
  })
  message: string[];

  @ApiProperty({
    example: '/auth/register',
    description: 'Endpoint donde ocurrió el error',
  })
  path: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Timestamp del error',
  })
  timestamp: string;
}

// Ejemplos de validación de contraseña
export class PasswordValidationExample {
  @ApiProperty({
    example: 'Contraseña123!',
    description: 'Contraseña válida que cumple con todos los requisitos',
  })
  validPassword: string;

  @ApiProperty({
    example: 'password',
    description: 'Contraseña inválida (muy común)',
  })
  invalidCommonPassword: string;

  @ApiProperty({
    example: '123',
    description: 'Contraseña inválida (muy corta)',
  })
  invalidShortPassword: string;

  @ApiProperty({
    example: 'sololetras',
    description: 'Contraseña inválida (solo letras minúsculas)',
  })
  invalidWeakPassword: string;
}

// Ejemplos de headers de rate limiting
export class RateLimitHeadersExample {
  @ApiProperty({
    example: '5',
    description: 'Número máximo de requests permitidos',
  })
  'x-ratelimit-limit': string;

  @ApiProperty({
    example: '3',
    description: 'Número de requests restantes',
  })
  'x-ratelimit-remaining': string;

  @ApiProperty({
    example: '1640995200',
    description: 'Timestamp cuando se resetea el rate limit',
  })
  'x-ratelimit-reset': string;
}

// Ejemplos de headers de seguridad
export class SecurityHeadersExample {
  @ApiProperty({
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token para autenticación',
  })
  'Authorization': string;

  @ApiProperty({
    example: 'application/json',
    description: 'Tipo de contenido de la petición',
  })
  'Content-Type': string;

  @ApiProperty({
    example: 'X-API-Key-12345',
    description: 'Clave API para endpoints premium',
  })
  'X-API-Key': string;
} 