import { IsString, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({
    description: 'Unique profile identifier',
    example: 'profile-123'
  })
  id: string;

  @ApiProperty({
    description: 'User identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  userId: string;

  @ApiProperty({
    description: 'User display name',
    example: 'John Doe'
  })
  displayName: string;

  @ApiProperty({ 
    required: false,
    description: 'User biography',
    example: 'Senior Full Stack Developer with 5 years of experience'
  })
  bio?: string;

  @ApiProperty({ 
    required: false,
    description: 'User avatar URL',
    example: 'https://example.com/avatars/user-123.png'
  })
  avatarUrl?: string;

  @ApiProperty({
    description: 'Profile creation timestamp',
    example: '2024-01-01T00:00:00.000Z'
  })
  created_at: Date;

  @ApiProperty({
    description: 'Profile last update timestamp',
    example: '2024-01-01T00:00:00.000Z'
  })
  updated_at: Date;
} 