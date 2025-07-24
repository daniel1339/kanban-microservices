import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsUrl, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ 
    required: false,
    description: 'User display name',
    example: 'John Doe',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'Display name must be a string' })
  @MinLength(1, { message: 'Display name cannot be empty' })
  @MaxLength(100, { message: 'Display name cannot exceed 100 characters' })
  displayName?: string;

  @ApiProperty({ 
    required: false,
    description: 'User biography',
    example: 'Senior Full Stack Developer with 5 years of experience',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'Biography must be a string' })
  @MaxLength(1000, { message: 'Biography cannot exceed 1000 characters' })
  bio?: string;

  @ApiProperty({ 
    required: false,
    description: 'User avatar URL',
    example: 'https://example.com/avatars/user-123.png',
  })
  @IsOptional()
  @IsString({ message: 'Avatar URL must be a string' })
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  avatarUrl?: string;
} 