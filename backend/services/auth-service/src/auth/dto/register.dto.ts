import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'El email debe ser válido' })
  @MaxLength(255, { message: 'El email no puede tener más de 255 caracteres' })
  email: string;

  @IsString({ message: 'El username debe ser una cadena de texto' })
  @MinLength(3, { message: 'El username debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El username no puede tener más de 100 caracteres' })
  @Matches(/^[a-zA-Z0-9_]+$/, { 
    message: 'El username solo puede contener letras, números y guiones bajos' 
  })
  username: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(255, { message: 'La contraseña no puede tener más de 255 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial'
  })
  password: string;

  @IsString({ message: 'La confirmación de contraseña debe ser una cadena de texto' })
  passwordConfirmation: string;
} 