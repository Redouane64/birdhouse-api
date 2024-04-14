import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Occupancy } from '../interfaces/birdhouse.interface';
import { BirdhouseEntity } from './birdhouse.entity';

@Entity({ name: 'occupancy_history' })
export class BirdhouseOccupancyEntity implements Occupancy {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('int', { nullable: false, default: 0 })
  birds: number;

  @Column('int', { nullable: false, default: 0 })
  eggs: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('uuid', { nullable: false })
  ubid: string;

  @ManyToOne(() => BirdhouseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'ubid',
    referencedColumnName: 'ubid',
    foreignKeyConstraintName: 'fk_birdhouse_occupancy_history_ubid',
  })
  birdhouse: BirdhouseEntity;
}
