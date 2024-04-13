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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  AddOccupancyDto,
  RegisterBirdhouseDto,
  UpdateBirdhouseDto,
} from './dtos';
import { HousesService } from './houses.service';
import { NotEmptyObjectPipe } from './pipes/not-empty-object.pipe';

@Controller('houses')
export class HousesController {
  constructor(private readonly houseService: HousesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() data: RegisterBirdhouseDto) {
    return await this.houseService.create(data);
  }

  @Patch(':ubid')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('ubid', new ParseUUIDPipe()) ubid: string,
    @Body(new NotEmptyObjectPipe()) data: UpdateBirdhouseDto,
  ) {
    return await this.houseService.update(ubid, data);
  }

  @Post(':ubid/occupancy')
  @HttpCode(HttpStatus.CREATED)
  async addOccupancy(
    @Param('ubid', new ParseUUIDPipe()) ubid: string,
    @Body() data: AddOccupancyDto,
  ) {
    return await this.houseService.updateOccupancy(ubid, data.eggs, data.birds);
  }

  @Get(':ubid')
  @HttpCode(HttpStatus.OK)
  async get(@Param('ubid', new ParseUUIDPipe()) ubid: string) {
    return await this.houseService.get(ubid);
  }
}
