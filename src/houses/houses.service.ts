import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { RegisterBirdhouseDto, UpdateBirdhouseDto } from './dtos';

@Injectable()
export class HousesService {
  constructor(
    @Inject(Pool)
    private readonly pool: Pool,
  ) {}

  async get(ubid: string) {
    const result = await this.pool.query(
      `SELECT name, longitude, latitude
       FROM houses
       WHERE ubid = $1`,
      [ubid],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`house does not exist`);
    }

    const [house] = result.rows;
    return house;
  }

  async create(data: RegisterBirdhouseDto) {
    const result = await this.pool.query(
      `INSERT INTO houses(name, longitude, latitude) VALUES ($1, $2, $3) RETURNING *`,
      [data.name, data.longitude, data.latitude],
    );
    const [house] = result.rows;
    return house;
  }

  async update(ubid: string, data: UpdateBirdhouseDto) {
    const result = await this.pool.query(
      `UPDATE houses
       SET name = $1, longitude = $2, latitude = $3
       WHERE ubid = $4
       RETURNING name, longitude, latitude`,
      [data.name, data.longitude, data.latitude, ubid],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`house does not exist`);
    }

    const [house] = result.rows;
    return house;
  }
}
