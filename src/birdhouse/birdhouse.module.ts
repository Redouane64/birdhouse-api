import { Module } from '@nestjs/common';
import { BirdhouseController } from './birdhouse.controller';
import { BirdhouseService } from './birdhouse.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BirdhouseEntity } from './entities/birdhouse.entity';
import { BirdhouseOccupancyEntity } from './entities/birdhouse-occupancy.entity';
import { JobService } from './job.service';
import { BirdhouseAdminController } from './birdhouse-admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BirdhouseEntity, BirdhouseOccupancyEntity]),
  ],
  controllers: [BirdhouseController, BirdhouseAdminController],
  providers: [BirdhouseService, JobService],
})
export class BirdhouseModule {}
