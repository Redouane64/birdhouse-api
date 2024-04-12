import { Module } from '@nestjs/common';
import { HousesController } from './houses.controller';

@Module({
  controllers: [HousesController],
})
export class HousesModule {}
