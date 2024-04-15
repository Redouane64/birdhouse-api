import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('/')
@Controller()
export class AppController {
  @ApiOperation({
    operationId: 'healthz',
    summary: 'Check API status',
  })
  @Get('healthz')
  @HttpCode(HttpStatus.OK)
  async get() {
    return {
      ok: true,
    };
  }
}
