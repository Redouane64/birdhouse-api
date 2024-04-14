import { Module } from '@nestjs/common';
import { BirdhouseController } from './birdhouse.controller';
import { BirdhouseService } from './birdhouse.service';

@Module({
  controllers: [BirdhouseController],
  providers: [BirdhouseService],
})
export class BirdhouseModule {}
