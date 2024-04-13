import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterBirdhouseDto, UpdateBirdhouseDto } from './dtos';
import { DataSource } from 'typeorm';
import { Birdhouse, Occupancy } from './interfaces/birdhouse.interface';

@Injectable()
export class HousesService {
  constructor(private readonly dataSource: DataSource) {}

  async get(ubid: string) {
    const [birdhouse] = await this.dataSource.query<Birdhouse[]>(
      `SELECT name, longitude, latitude
       FROM birdhouses
       WHERE ubid = $1`,
      [ubid],
    );

    if (!birdhouse) {
      throw new NotFoundException(`birdhouse does not exist`);
    }

    const [occupancy] = await this.dataSource.query<Occupancy[]>(
      `SELECT eggs, birds FROM birdhouses_history WHERE ubid = $1 ORDER BY created_at DESC LIMIT 1`,
      [ubid],
    );

    return { ...birdhouse, ...occupancy };
  }

  async create(data: RegisterBirdhouseDto) {
    const [birdhouse, occupancy] = await this.dataSource.transaction(
      'SERIALIZABLE',
      async (manager) => {
        const [birdhouse] = await manager.query<Birdhouse[]>(
          `INSERT INTO birdhouses(name, longitude, latitude) VALUES ($1, $2, $3) RETURNING *`,
          [data.name, data.longitude, data.latitude],
        );
        const [occupancy] = await manager.query<Occupancy[]>(
          `INSERT INTO birdhouses_history(ubid, eggs, birds) VALUES ($1, $2, $3) RETURNING birds, eggs`,
          [birdhouse.ubid, 0, 0],
        );
        return [birdhouse, occupancy];
      },
    );

    return { ...birdhouse, ...occupancy };
  }

  async update(ubid: string, data: UpdateBirdhouseDto) {
    const birdhouse = await this.updateBirdhouse(ubid, data);

    if (!birdhouse) {
      throw new NotFoundException(`Birdhouse does not exist`);
    }

    const [occupancy] = await this.dataSource.query<Occupancy[]>(
      `SELECT eggs, birds FROM birdhouses_history WHERE ubid =  $1`,
      [ubid],
    );

    return { ...birdhouse, ...occupancy };
  }

  async updateOccupancy(ubid: string, eggs: number, birds: number) {
    const [birdhouse] = await this.dataSource.query<Birdhouse[]>(
      `SELECT name, longitude, latitude
        FROM birdhouses
        WHERE ubid = $1
        LIMIT 1`,
      [ubid],
    );

    if (!birdhouse) {
      throw new NotFoundException(`birdhouse does not exist`);
    }

    const [occupancy] = await this.dataSource.query<Occupancy[]>(
      `INSERT INTO birdhouses_history(ubid, eggs, birds) VALUES ($1, $2, $3) RETURNING birds, eggs`,
      [ubid, eggs, birds],
    );

    return { ...birdhouse, ...occupancy };
  }

  async updateBirdhouse(ubid: string, data: UpdateBirdhouseDto) {
    const updateResult = await this.dataSource
      .createQueryBuilder()
      .update<Birdhouse>('birdhouses', {
        name: data.name,
        longitude: data.longitude,
        latitude: data.latitude,
      })
      .where('ubid = :ubid', { ubid })
      .returning('name, longitude, latitude')
      .execute();

    if (updateResult.affected === 0) {
      return null;
    }

    const [birdhouse] = updateResult.raw;
    return birdhouse;
  }
}