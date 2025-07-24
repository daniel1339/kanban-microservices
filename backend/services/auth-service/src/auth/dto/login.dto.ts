import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email or username. Can be a valid email or a username.',
    oneOf: [
      { type: 'string', format: 'email' },
      { type: 'string', pattern: '^[a-zA-Z0-9_]+$' },
    ],
  })
  @IsString({ message: 'Email or username must be a string' })
  @MaxLength(255, { message: 'Email or username cannot be longer than 255 characters' })
  emailOrUsername: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password. Must meet security requirements.',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(1, { message: 'Password is required' })
  @MaxLength(255, { message: 'Password cannot be longer than 255 characters' })
  password: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Optional refresh token to renew tokens. Only used in refresh flows.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Refresh token must be a string' })
  refreshToken?: string;
} 