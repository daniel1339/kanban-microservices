import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword, IsNotCommonPassword } from '../../common/validators/password.validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Valid user email. Must be unique and in email format.',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
  })
  @IsEmail({}, { message: 'Email must be valid' })
  @MaxLength(255, { message: 'Email cannot be longer than 255 characters' })
  email: string;

  @ApiProperty({
    example: 'user123',
    description: 'Unique username (3-100 characters, only letters, numbers, and underscores). Must be unique.',
    minLength: 3,
    maxLength: 100,
    pattern: '^[a-zA-Z0-9_]+$',
  })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @MaxLength(100, { message: 'Username cannot be longer than 100 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores'
  })
  username: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.',
    minLength: 8,
    maxLength: 255,
  })
  @IsString({ message: 'Password must be a string' })
  @MaxLength(255, { message: 'Password cannot be longer than 255 characters' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
    message:
      'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
  })
  password: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password confirmation (must match password).',
  })
  @IsString({ message: 'Password confirmation must be a string' })
  passwordConfirmation: string;
} 