import { Module } from '@nestjs/common';
import { HouseController } from './house.controller';

@Module({
  controllers: [HouseController],
})
export class HouseModule {}
