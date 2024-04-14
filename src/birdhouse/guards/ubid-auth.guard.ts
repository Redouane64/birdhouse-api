import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { BirdhouseEntity } from '../entities/birdhouse.entity';

@Injectable()
export class UbidAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(BirdhouseEntity)
    private readonly birdhouses: Repository<BirdhouseEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const ubid = request.headers['x-ubid'] as string;

    if (!ubid) {
      return false;
    }

    if (!isUUID(ubid)) {
      return false;
    }

    const birdhouse = await this.birdhouses.findOne({ where: { ubid } });
    // TODO: cache birdhouse instance for down stream use
    return !!birdhouse;
  }
}
