import { Controller, Get, Post, Put, Body, Param, Req, Res, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import axios from 'axios';

@Controller('api/users')
@Public()
export class UserProxyController {
  private readonly logger = new Logger(UserProxyController.name);
  private readonly userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3002';

  @Get('health')
  @Public()
  async health(@Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`Checking user service health at ${this.userServiceUrl}/api/health`);
      
      const response = await axios.get(`${this.userServiceUrl}/api/health`, {
        timeout: 5000,
      });

      this.logger.log(`Health check successful - Status: ${response.status}`);
      return res.status(response.status).json(response.data);
    } catch (error: any) {
      this.logger.error(`Health check failed: ${error.message}`);
      
      if (error.response) {
        this.logger.error(`Error response status: ${error.response.status}`);
        this.logger.error(`Error response data:`, error.response.data);
        return res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        this.logger.error(`No response received`);
        return res.status(HttpStatus.GATEWAY_TIMEOUT).json({
          statusCode: HttpStatus.GATEWAY_TIMEOUT,
          message: 'User service is not responding',
          error: 'Gateway Timeout',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        });
      } else {
        this.logger.error(`Request setup error: ${error.message}`);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'Internal Server Error',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        });
      }
    }
  }

  @Get('profile')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`Getting user profile from ${this.userServiceUrl}/api/profile`);
      
      const response = await axios.get(`${this.userServiceUrl}/api/profile`, {
        headers: {
          'Authorization': req.headers.authorization,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      this.logger.log(`Profile retrieved successfully - Status: ${response.status}`);
      return res.status(response.status).json(response.data);
    } catch (error: any) {
      this.logger.error(`Get profile failed: ${error.message}`);
      
      if (error.response) {
        this.logger.error(`Error response status: ${error.response.status}`);
        this.logger.error(`Error response data:`, error.response.data);
        return res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        this.logger.error(`No response received`);
        return res.status(HttpStatus.GATEWAY_TIMEOUT).json({
          statusCode: HttpStatus.GATEWAY_TIMEOUT,
          message: 'User service is not responding',
          error: 'Gateway Timeout',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        });
      } else {
        this.logger.error(`Request setup error: ${error.message}`);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'Internal Server Error',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        });
      }
    }
  }

  @Put('profile')
  async updateProfile(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`Updating user profile at ${this.userServiceUrl}/api/profile`);
      this.logger.log(`Request body:`, body);

      const response = await axios.put(`${this.userServiceUrl}/api/profile`, body, {
        headers: {
          'Authorization': req.headers.authorization,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      this.logger.log(`Profile updated successfully - Status: ${response.status}`);
      return res.status(response.status).json(response.data);
    } catch (error: any) {
      this.logger.error(`Update profile failed: ${error.message}`);
      
      if (error.response) {
        this.logger.error(`Error response status: ${error.response.status}`);
        this.logger.error(`Error response data:`, error.response.data);
        return res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        this.logger.error(`No response received`);
        return res.status(HttpStatus.GATEWAY_TIMEOUT).json({
          statusCode: HttpStatus.GATEWAY_TIMEOUT,
          message: 'User service is not responding',
          error: 'Gateway Timeout',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        });
      } else {
        this.logger.error(`Request setup error: ${error.message}`);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'Internal Server Error',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        });
      }
    }
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: string, @Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`Getting public profile for user ${userId} from ${this.userServiceUrl}/api/users/${userId}`);
      
      const response = await axios.get(`${this.userServiceUrl}/api/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      this.logger.log(`Public profile retrieved successfully - Status: ${response.status}`);
      return res.status(response.status).json(response.data);
    } catch (error: any) {
      this.logger.error(`Get public profile failed: ${error.message}`);
      
      if (error.response) {
        this.logger.error(`Error response status: ${error.response.status}`);
        this.logger.error(`Error response data:`, error.response.data);
        return res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        this.logger.error(`No response received`);
        return res.status(HttpStatus.GATEWAY_TIMEOUT).json({
          statusCode: HttpStatus.GATEWAY_TIMEOUT,
          message: 'User service is not responding',
          error: 'Gateway Timeout',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        });
      } else {
        this.logger.error(`Request setup error: ${error.message}`);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'Internal Server Error',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        });
      }
    }
  }

  @Post('avatar/upload')
  async uploadAvatar(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`Uploading avatar to ${this.userServiceUrl}/api/avatar/upload`);
      this.logger.log(`Request body:`, body);

      const response = await axios.post(`${this.userServiceUrl}/api/avatar/upload`, body, {
        headers: {
          'Authorization': req.headers.authorization,
          'Content-Type': 'application/json',
        },
        timeout: 15000, // Longer timeout for file uploads
      });

      this.logger.log(`Avatar uploaded successfully - Status: ${response.status}`);
      return res.status(response.status).json(response.data);
    } catch (error: any) {
      this.logger.error(`Avatar upload failed: ${error.message}`);
      
      if (error.response) {
        this.logger.error(`Error response status: ${error.response.status}`);
        this.logger.error(`Error response data:`, error.response.data);
        return res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        this.logger.error(`No response received`);
        return res.status(HttpStatus.GATEWAY_TIMEOUT).json({
          statusCode: HttpStatus.GATEWAY_TIMEOUT,
          message: 'User service is not responding',
          error: 'Gateway Timeout',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        });
      } else {
        this.logger.error(`Request setup error: ${error.message}`);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          error: 'Internal Server Error',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        });
      }
    }
  }

} 