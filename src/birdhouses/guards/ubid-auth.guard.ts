import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Request } from 'express';
import { DataSource } from 'typeorm';

@Injectable()
export class UbidAuthGuard implements CanActivate {
  constructor(private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const ubid = request.headers['x-ubid'];

    if (!ubid) {
      return false;
    }

    if (!isUUID(ubid)) {
      return false;
    }

    const [birdhouse] = await this.dataSource.query(
      'SELECT ubid FROM birdhouses WHERE ubid = $1 LIMIT 1',
      [ubid],
    );

    return !!birdhouse;
  }
}
