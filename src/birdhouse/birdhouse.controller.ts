import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  AddOccupancyDto,
  RegisterBirdhouseDto,
  UpdateBirdhouseDto,
} from './dtos';
import { BirdhouseService } from './birdhouse.service';
import { NotEmptyObjectPipe } from './pipes/not-empty-object.pipe';
import { UbidAuthGuard } from './guards/ubid-auth.guard';
import { BasicAuthGuard } from './guards/basic-auth.guard';

@Controller('house')
export class BirdhouseController {
  constructor(private readonly houseService: BirdhouseService) {}

  @Post('seed')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(BasicAuthGuard)
  async seed(@Body() data: RegisterBirdhouseDto[]) {
    return await this.houseService.createMany(data);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() data: RegisterBirdhouseDto) {
    return await this.houseService.create(data);
  }

  @Patch(':ubid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UbidAuthGuard)
  async update(
    @Param('ubid', new ParseUUIDPipe()) ubid: string,
    @Body(new NotEmptyObjectPipe()) data: UpdateBirdhouseDto,
  ) {
    return await this.houseService.update(ubid, data);
  }

  @Post(':ubid/occupancy')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(UbidAuthGuard)
  async addOccupancy(
    @Param('ubid', new ParseUUIDPipe()) ubid: string,
    @Body() data: AddOccupancyDto,
  ) {
    return await this.houseService.updateOccupancy(ubid, data.eggs, data.birds);
  }

  @Get(':ubid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UbidAuthGuard)
  async get(@Param('ubid', new ParseUUIDPipe()) ubid: string) {
    return await this.houseService.get(ubid);
  }
}
