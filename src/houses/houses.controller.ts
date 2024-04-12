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

@Controller('house')
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
    @Body() data: UpdateBirdhouseDto,
  ) {
    return await this.houseService.update(ubid, data);
  }

  @Post(':ubid/occupancy')
  @HttpCode(HttpStatus.CREATED)
  addOccupancy(
    @Param('ubid', new ParseUUIDPipe()) ubid: string,
    @Body() data: AddOccupancyDto,
  ) {
    // TODO: implement this
    return Object.assign(
      {
        ubid,
        name: 'meadows',
        latitude: 12.234,
        longitude: 45.678,
      },
      data,
    );
  }

  @Get(':ubid')
  @HttpCode(HttpStatus.OK)
  async get(@Param('ubid', new ParseUUIDPipe()) ubid: string) {
    return await this.houseService.get(ubid);
  }
}
