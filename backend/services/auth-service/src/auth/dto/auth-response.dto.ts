import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'Unique user ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'Username', example: 'user123' })
  username: string;

  @ApiProperty({ description: 'Whether the user is verified', example: true })
  isVerified: boolean;

  @ApiProperty({ description: 'Creation date', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'User data', type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ description: 'JWT access token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;

  @ApiProperty({ description: 'Expiration time in seconds', example: 900 })
  expiresIn: number;
} 