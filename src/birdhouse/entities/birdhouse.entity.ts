import {
  Column,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Birdhouse, Occupancy } from '../interfaces/birdhouse.interface';
import { BirdhouseOccupancyEntity } from './birdhouse-occupancy.entity';

@Entity({ name: 'birdhouses' })
@Unique('idx_birdhouses_ubid', ['ubid'])
export class BirdhouseEntity implements Omit<Birdhouse, 'eggs' | 'birds'> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: false })
  @Generated('uuid')
  ubid: string;

  @Column('varchar', { nullable: false, length: 16 })
  name: string;

  @Column('float', { nullable: false })
  longitude: number;

  @Column('float', { nullable: false })
  latitude: number;

  @OneToMany(() => BirdhouseOccupancyEntity, (e) => e.birdhouse)
  occupancy: Occupancy[];
}
