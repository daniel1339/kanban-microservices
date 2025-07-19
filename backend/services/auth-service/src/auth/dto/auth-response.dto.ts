import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'ID único del usuario' })
  id: string;

  @ApiProperty({ description: 'Email del usuario' })
  email: string;

  @ApiProperty({ description: 'Nombre de usuario' })
  username: string;

  @ApiProperty({ description: 'Si el usuario está verificado' })
  isVerified: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'Datos del usuario', type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ description: 'Token de acceso JWT' })
  accessToken: string;

  @ApiProperty({ description: 'Token de renovación' })
  refreshToken: string;

  @ApiProperty({ description: 'Tiempo de expiración en segundos' })
  expiresIn: number;
} 