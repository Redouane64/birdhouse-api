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
  BirdhouseResponse,
  RegisterBirdhouseDto,
  RegisterBirdhouseResponse,
  UpdateBirdhouseDto,
} from './dtos';
import { BirdhouseService } from './birdhouse.service';
import { NotEmptyObjectPipe } from './pipes/not-empty-object.pipe';
import { UbidAuthGuard } from './guards/ubid-auth.guard';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Birdhouse')
@Controller('house')
export class BirdhouseController {
  constructor(private readonly houseService: BirdhouseService) {}

  @ApiOperation({
    operationId: 'register',
    summary: 'Register a birdhouse',
  })
  @ApiCreatedResponse({ type: RegisterBirdhouseResponse })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() data: RegisterBirdhouseDto) {
    return await this.houseService.create(data);
  }

  @ApiOperation({
    operationId: 'update',
    summary: 'Update birdhouse data',
  })
  @ApiHeader({ name: 'X-UBID', required: true })
  @ApiOkResponse({ type: [BirdhouseResponse] })
  @Patch(':ubid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UbidAuthGuard)
  async update(
    @Param('ubid', new ParseUUIDPipe()) ubid: string,
    @Body(new NotEmptyObjectPipe()) data: UpdateBirdhouseDto,
  ) {
    return await this.houseService.update(ubid, data);
  }

  @ApiOperation({
    operationId: 'updateOccupancy',
    summary: 'Update birdhouse occupancy',
  })
  @ApiHeader({ name: 'X-UBID', required: true })
  @ApiCreatedResponse({ type: [BirdhouseResponse] })
  @Post(':ubid/occupancy')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(UbidAuthGuard)
  async addOccupancy(
    @Param('ubid', new ParseUUIDPipe()) ubid: string,
    @Body() data: AddOccupancyDto,
  ) {
    return await this.houseService.updateOccupancy(ubid, data.eggs, data.birds);
  }

  @ApiOperation({
    operationId: 'get',
    summary: 'Get birdhouse by UBID',
  })
  @ApiHeader({
    name: 'X-UBID',
    required: true,
  })
  @ApiOkResponse({ type: [BirdhouseResponse] })
  @Get(':ubid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UbidAuthGuard)
  async get(@Param('ubid', new ParseUUIDPipe()) ubid: string) {
    return await this.houseService.get(ubid);
  }
}
