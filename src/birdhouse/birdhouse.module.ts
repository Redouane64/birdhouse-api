import { Module } from '@nestjs/common';
import { BirdhouseController } from './birdhouse.controller';
import { BirdhouseService } from './birdhouse.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BirdhouseEntity } from './entities/birdhouse.entity';
import { BirdhouseOccupancyEntity } from './entities/birdhouse-occupancy.entity';
import { JobsService } from './jobs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BirdhouseEntity, BirdhouseOccupancyEntity]),
  ],
  controllers: [BirdhouseController],
  providers: [BirdhouseService, JobsService],
})
export class BirdhouseModule {}
