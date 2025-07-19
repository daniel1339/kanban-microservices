import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDto {
  @ApiProperty({
    description: 'Campo que causó el error',
    example: 'email',
  })
  field: string;

  @ApiProperty({
    description: 'Valor que causó el error',
    example: 'invalid-email',
  })
  value: any;

  @ApiProperty({
    description: 'Restricciones de validación que fallaron',
    example: {
      isEmail: 'email must be an email',
    },
  })
  constraints: Record<string, string>;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje de error',
    example: 'Validation failed',
  })
  message: string | string[];

  @ApiProperty({
    description: 'Tipo de error',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp del error',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Ruta que causó el error',
    example: '/auth/register',
  })
  path: string;

  @ApiProperty({
    description: 'Método HTTP',
    example: 'POST',
  })
  method: string;

  @ApiProperty({
    description: 'ID único del request',
    example: 'req_1705312200000_abc123def',
    required: false,
  })
  requestId?: string;

  @ApiProperty({
    description: 'Errores de validación específicos',
    type: [ValidationErrorDto],
    required: false,
  })
  errors?: ValidationErrorDto[];
} 