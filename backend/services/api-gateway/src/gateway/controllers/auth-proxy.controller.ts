import { Controller, Post, Body, Get, Req, Res, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import axios from 'axios';

@Controller('api/auth')
@Public()
export class AuthProxyController {
  private readonly logger = new Logger(AuthProxyController.name);
  private readonly authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';

  @Post('register')
  async register(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/api/auth/register`, body, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      return res.status(response.status).json(response.data);
    } catch (error: any) {
      this.logger.error(`Registration failed: ${error.message}`);
      
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        return res.status(HttpStatus.GATEWAY_TIMEOUT).json({
          statusCode: HttpStatus.GATEWAY_TIMEOUT,
          message: 'Auth service is not responding',
          error: 'Gateway Timeout',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        });
      } else {
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

  @Post('login')
  async login(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      // Transform request body to match LoginDto structure
      const loginData = {
        emailOrUsername: body.email || body.username || body.emailOrUsername,
        password: body.password,
        refreshToken: body.refreshToken
      };

      const response = await axios.post(`${this.authServiceUrl}/api/auth/login`, loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      return res.status(response.status).json(response.data);
    } catch (error: any) {
      this.logger.error(`Login failed: ${error.message}`);
      
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        return res.status(HttpStatus.GATEWAY_TIMEOUT).json({
          statusCode: HttpStatus.GATEWAY_TIMEOUT,
          message: 'Auth service is not responding',
          error: 'Gateway Timeout',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        });
      } else {
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

  @Get('health')
  async health(@Req() req: Request, @Res() res: Response) {
    try {
      const response = await axios.get(`${this.authServiceUrl}/api/health`, {
        timeout: 5000,
      });

      return res.status(response.status).json(response.data);
    } catch (error: any) {
      this.logger.error(`Health check failed: ${error.message}`);
      
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        return res.status(HttpStatus.GATEWAY_TIMEOUT).json({
          statusCode: HttpStatus.GATEWAY_TIMEOUT,
          message: 'Auth service is not responding',
          error: 'Gateway Timeout',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        });
      } else {
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