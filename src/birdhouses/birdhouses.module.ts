import { Module } from '@nestjs/common';
import { BirdhousesController } from './birdhouses.controller';
import { HousesService } from './birdhouses.service';

@Module({
  controllers: [BirdhousesController],
  providers: [HousesService],
})
export class BirdhousesModule {}
