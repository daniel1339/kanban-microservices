import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Email o nombre de usuario del usuario',
    oneOf: [
      { type: 'string', format: 'email' },
      { type: 'string', pattern: '^[a-zA-Z0-9_]+$' },
    ],
  })
  @IsString({ message: 'El email o username debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El email o username no puede tener más de 255 caracteres' })
  emailOrUsername: string;

  @ApiProperty({
    example: 'Contraseña123!',
    description: 'Contraseña del usuario',
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(1, { message: 'La contraseña es requerida' })
  @MaxLength(255, { message: 'La contraseña no puede tener más de 255 caracteres' })
  password: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token opcional para renovar tokens',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El refresh token debe ser una cadena de texto' })
  refreshToken?: string;
} 