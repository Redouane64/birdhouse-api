import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BirdhouseResponse, RegisterBirdhouseDto } from './dtos';
import { BirdhouseService } from './birdhouse.service';
import { BasicAuthGuard } from './guards/basic-auth.guard';
import {
  ApiBasicAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('house')
export class BirdhouseAdminController {
  constructor(private readonly houseService: BirdhouseService) {}

  @ApiTags('Admin')
  @ApiOperation({
    operationId: 'seed',
    summary: 'Perform bulk birdhouse registration',
  })
  @ApiBasicAuth()
  @ApiBody({ type: [RegisterBirdhouseDto] })
  @ApiCreatedResponse({ type: [BirdhouseResponse] })
  @Post('seed')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(BasicAuthGuard)
  async seed(@Body() data: RegisterBirdhouseDto[]) {
    return await this.houseService.createMany(data);
  }
}
