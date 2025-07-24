import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDto {
  @ApiProperty({
    description: 'Field that caused the error',
    example: 'email',
  })
  field: string;

  @ApiProperty({
    description: 'Value that caused the error',
    example: 'invalid-email',
  })
  value: any;

  @ApiProperty({
    description: 'Validation constraints that failed',
    example: {
      isEmail: 'email must be an email',
    },
  })
  constraints: Record<string, string>;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
  })
  message: string | string[];

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: 'Error timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Path that caused the error',
    example: '/auth/register',
  })
  path: string;

  @ApiProperty({
    description: 'HTTP method',
    example: 'POST',
  })
  method: string;

  @ApiProperty({
    description: 'Unique request ID',
    example: 'req_1705312200000_abc123def',
    required: false,
  })
  requestId?: string;

  @ApiProperty({
    description: 'Specific validation errors',
    type: [ValidationErrorDto],
    required: false,
  })
  errors?: ValidationErrorDto[];
} 