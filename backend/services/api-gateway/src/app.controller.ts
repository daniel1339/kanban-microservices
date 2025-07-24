import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('gateway')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @ApiOperation({ summary: 'Hello endpoint', description: 'Returns Hello World!' })
  getHello(): string {
    return this.appService.getHello();
  }
}
