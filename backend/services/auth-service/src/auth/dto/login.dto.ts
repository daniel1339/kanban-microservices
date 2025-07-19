import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'El email o username debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El email o username no puede tener más de 255 caracteres' })
  emailOrUsername: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(1, { message: 'La contraseña es requerida' })
  @MaxLength(255, { message: 'La contraseña no puede tener más de 255 caracteres' })
  password: string;

  @IsOptional()
  @IsString({ message: 'El refresh token debe ser una cadena de texto' })
  refreshToken?: string;
} 