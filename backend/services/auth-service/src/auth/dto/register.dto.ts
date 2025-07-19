import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword, IsNotCommonPassword } from '../../common/validators/password.validator';

export class RegisterDto {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Email válido del usuario',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @MaxLength(255, { message: 'El email no puede tener más de 255 caracteres' })
  email: string;

  @ApiProperty({
    example: 'usuario123',
    description: 'Nombre de usuario único (3-100 caracteres, solo letras, números y guiones bajos)',
    minLength: 3,
    maxLength: 100,
    pattern: '^[a-zA-Z0-9_]+$',
  })
  @IsString({ message: 'El username debe ser una cadena de texto' })
  @MinLength(3, { message: 'El username debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El username no puede tener más de 100 caracteres' })
  @Matches(/^[a-zA-Z0-9_]+$/, { 
    message: 'El username solo puede contener letras, números y guiones bajos' 
  })
  username: string;

  @ApiProperty({
    example: 'Contraseña123!',
    description: 'Contraseña segura (mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos)',
    minLength: 8,
    maxLength: 255,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La contraseña no puede tener más de 255 caracteres' })
  @IsStrongPassword()
  @IsNotCommonPassword()
  password: string;

  @ApiProperty({
    example: 'Contraseña123!',
    description: 'Confirmación de la contraseña (debe coincidir con password)',
  })
  @IsString({ message: 'La confirmación de contraseña debe ser una cadena de texto' })
  passwordConfirmation: string;
} 