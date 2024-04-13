import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('healthz')
  @HttpCode(HttpStatus.OK)
  async get() {
    return {
      ok: true,
    };
  }
}
