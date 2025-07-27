import { Controller, Post, Body, Get, Req, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import axios from 'axios';

@Controller('api/auth')
@Public()
export class AuthProxyController {
  private readonly authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';

  @Post('register')
  async register(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    try {
      console.log(`🔍 AuthProxyController: Registering user to ${this.authServiceUrl}/api/auth/register`);
      console.log(`🔍 AuthProxyController: Request body:`, body);

      const response = await axios.post(`${this.authServiceUrl}/api/auth/register`, body, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      console.log(`✅ AuthProxyController: Registration successful - Status: ${response.status}`);
      return res.status(response.status).json(response.data);
    } catch (error: any) {
      console.log(`❌ AuthProxyController: Registration failed - ${error.message}`);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(`❌ AuthProxyController: Error response status: ${error.response.status}`);
        console.log(`❌ AuthProxyController: Error response data:`, error.response.data);
        return res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(`❌ AuthProxyController: No response received`);
        return res.status(HttpStatus.GATEWAY_TIMEOUT).json({
          statusCode: HttpStatus.GATEWAY_TIMEOUT,
          message: 'Auth service is not responding',
          error: 'Gateway Timeout',
          timestamp: new Date().toISOString(),
          path: req.path,
          method: req.method,
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log(`❌ AuthProxyController: Request setup error: ${error.message}`);
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
      console.log(`🔍 AuthProxyController: Logging in user to ${this.authServiceUrl}/api/auth/login`);
      console.log(`🔍 AuthProxyController: Request body:`, body);

      const response = await axios.post(`${this.authServiceUrl}/api/auth/login`, body, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      console.log(`✅ AuthProxyController: Login successful - Status: ${response.status}`);
      return res.status(response.status).json(response.data);
    } catch (error: any) {
      console.log(`❌ AuthProxyController: Login failed - ${error.message}`);
      
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
      console.log(`🔍 AuthProxyController: Checking auth service health at ${this.authServiceUrl}/api/health`);

      const response = await axios.get(`${this.authServiceUrl}/api/health`, {
        timeout: 5000,
      });

      console.log(`✅ AuthProxyController: Health check successful - Status: ${response.status}`);
      return res.status(response.status).json(response.data);
    } catch (error: any) {
      console.log(`❌ AuthProxyController: Health check failed - ${error.message}`);
      
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