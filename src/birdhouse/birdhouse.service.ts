import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterBirdhouseDto, UpdateBirdhouseDto } from './dtos';
import { DataSource, Repository } from 'typeorm';
import { BirdhouseEntity } from './entities/birdhouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BirdhouseOccupancyEntity } from './entities/birdhouse-occupancy.entity';
import { Birdhouse } from './interfaces/birdhouse.interface';

@Injectable()
export class BirdhouseService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(BirdhouseEntity)
    private readonly birdhouses: Repository<BirdhouseEntity>,
    @InjectRepository(BirdhouseOccupancyEntity)
    private readonly occupancyHistory: Repository<BirdhouseOccupancyEntity>,
  ) {}

  async get(ubid: string) {
    const birdhouse = await this.birdhouses.findOne({
      where: { ubid },
    });

    if (!birdhouse) {
      throw new NotFoundException(`Birdhouse does not exist`);
    }

    const [occupancy] = await this.occupancyHistory.find({
      where: { ubid },
      order: { createdAt: 'DESC' },
      take: 1,
    });

    return {
      name: birdhouse.name,
      longitude: birdhouse.longitude,
      latitude: birdhouse.latitude,
      eggs: occupancy.eggs,
      birds: occupancy.birds,
    };
  }

  async create(data: RegisterBirdhouseDto) {
    const birdhouse = await this.dataSource.transaction(
      'SERIALIZABLE',
      async () => {
        const birdhouse = await this.birdhouses.save(
          {
            name: data.name,
            longitude: data.longitude,
            latitude: data.latitude,
          },
          { reload: true },
        );

        const occupancy = await this.occupancyHistory.save({
          birdhouse,
        });

        return {
          id: birdhouse.id,
          ubid: birdhouse.ubid,
          name: birdhouse.name,
          longitude: birdhouse.longitude,
          latitude: birdhouse.latitude,
          eggs: occupancy.eggs,
          birds: occupancy.birds,
        };
      },
    );

    return birdhouse;
  }

  async update(ubid: string, data: UpdateBirdhouseDto) {
    const birdhouse = await this.birdhouses.findOne({
      where: { ubid },
    });

    if (!birdhouse) {
      throw new NotFoundException(`Birdhouse does not exist`);
    }
    const updateResult = await this.birdhouses.update(
      {
        ubid,
      },
      {
        name: data.name,
        longitude: data.longitude,
        latitude: data.latitude,
      },
    );

    if (updateResult.affected === 1) {
      Object.assign(birdhouse, data);
    }

    const [occupancy] = await this.occupancyHistory.find({
      where: { ubid },
      order: { createdAt: 'DESC' },
      take: 1,
    });

    return {
      name: birdhouse.name,
      longitude: birdhouse.longitude,
      latitude: birdhouse.latitude,
      eggs: occupancy.eggs,
      birds: occupancy.birds,
    };
  }

  async updateOccupancy(ubid: string, eggs: number, birds: number) {
    const birdhouse = await this.birdhouses.findOne({
      where: { ubid },
    });

    if (!birdhouse) {
      throw new NotFoundException(`Birdhouse does not exist`);
    }

    await this.occupancyHistory.save(
      {
        eggs,
        birds,
        ubid,
      },
      { transaction: false },
    );

    return {
      name: birdhouse.name,
      longitude: birdhouse.longitude,
      latitude: birdhouse.latitude,
      eggs,
      birds,
    };
  }

  async createMany(data: RegisterBirdhouseDto[]) {
    return await this.dataSource.transaction<Birdhouse>(async () => {
      const birdhouses = await this.birdhouses.save(data, {
        reload: true,
        transaction: false,
      });
      const occupancy = await Promise.all(
        birdhouses.map(({ ubid }) => {
          return this.occupancyHistory.save({ ubid }, { transaction: false });
        }),
      );

      return this.joinArrays(birdhouses, occupancy, 'ubid').map(
        (birdhouse) => ({
          ubid: birdhouse.ubid,
          name: birdhouse.name,
          longitude: birdhouse.longitude,
          latitude: birdhouse.latitude,
          eggs: birdhouse.eggs,
          birds: birdhouse.birds,
        }),
      );
    });
  }

  // Join arrays based on the common field
  joinArrays(arrayA, arrayB, commonField) {
    // Create a map from arrayB using the common field
    const map = arrayB.reduce((acc, obj) => {
      acc[obj[commonField]] = obj;
      return acc;
    }, {});

    return arrayA.map((item) => ({
      ...item,
      ...map[item[commonField]],
    }));
  }
}
