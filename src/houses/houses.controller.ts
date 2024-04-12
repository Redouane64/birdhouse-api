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

@Controller('house')
export class HousesController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  register(@Body() data: RegisterBirdhouseDto) {
    // TODO: implement this
    return data;
  }

  @Patch(':ubid')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('ubid', new ParseUUIDPipe()) ubid: string,
    @Body() data: UpdateBirdhouseDto,
  ) {
    // TODO: implement this
    return Object.assign({ ubid }, data);
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
  get(@Param('ubid', new ParseUUIDPipe()) ubid: string) {
    return {
      ubid,
      name: 'meadows',
      latitude: 12.234,
      longitude: 45.678,
    };
  }
}
