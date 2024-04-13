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
       FROM birdhouses
       WHERE ubid = $1`,
      [ubid],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`house does not exist`);
    }

    const history = await this.pool.query(
      `SELECT eggs, birds FROM birdhouses_history WHERE ubid = $1 ORDER BY created_at DESC LIMIT 1`,
      [ubid],
    );
    const [entry] = history.rows;
    const [house] = result.rows;
    return { ...house, birds: entry.birds, eggs: entry.eggs };
  }

  async create(data: RegisterBirdhouseDto) {
    const birdhouse = await this.pool.query(
      `INSERT INTO birdhouses(name, longitude, latitude) VALUES ($1, $2, $3) RETURNING *`,
      [data.name, data.longitude, data.latitude],
    );
    const [house] = birdhouse.rows;
    const history = await this.pool.query(
      `INSERT INTO birdhouses_history(ubid, eggs, birds) VALUES ($1, $2, $3) RETURNING birds, eggs`,
      [house.ubid, 0, 0],
    );
    const [entry] = history.rows;
    const { birds, eggs } = entry;

    return { ...house, birds, eggs };
  }

  async update(ubid: string, data: UpdateBirdhouseDto) {
    const result = await this.pool.query(
      `UPDATE birdhouses
       SET name = $1, longitude = $2, latitude = $3
       WHERE ubid = $4
       RETURNING name, longitude, latitude`,
      [data.name, data.longitude, data.latitude, ubid],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`house does not exist`);
    }

    const history = await this.pool.query(
      `SELECT ubid, eggs, birds FROM birdhouses_history WHERE ubid =  $1`,
      [ubid],
    );
    const [house] = result.rows;
    const [entry] = history.rows;
    const { eggs, birds } = entry;
    return { ...house, eggs, birds };
  }
}
