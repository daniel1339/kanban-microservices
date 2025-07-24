import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { ProfileDto } from '../dtos/profile.dto';
import { 
  GetUserByIdResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  BadRequestResponse,
  InternalServerErrorResponse
} from '../../docs/responses/user.responses';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  @ApiOperation({ 
    summary: 'Get public profile of a user',
    description: 'Returns the public information of a specific user profile.'
  })
  @ApiParam({ 
    name: 'userId', 
    description: 'Unique user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string'
  })
  @GetUserByIdResponse
  @NotFoundResponse
  @UnauthorizedResponse
  @BadRequestResponse
  @InternalServerErrorResponse
  async getUserById(@Param('userId') userId: string): Promise<ProfileDto> {
    try {
      return await this.userService.getPublicProfile(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Ensure the error has the correct structure
        throw new NotFoundException({
          statusCode: 404,
          message: error.message,
          error: 'Not Found',
          timestamp: new Date().toISOString(),
          path: `/users/${userId}`,
        });
      }
      throw error;
    }
  }
} 