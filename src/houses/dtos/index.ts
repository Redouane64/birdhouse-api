import {
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsPositive,
  Length,
} from 'class-validator';
import { Birdhouse } from '../interfaces/birdhouse.interface';

export class RegisterBirdhouseDto
  implements Pick<Birdhouse, 'name' | 'latitude' | 'longitude'>
{
  @Length(4, 16)
  name: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}

export class UpdateBirdhouseDto
  implements Partial<Pick<Birdhouse, 'name' | 'latitude' | 'longitude'>>
{
  @IsOptional()
  @Length(4, 16)
  name?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;
}

export class AddOccupancyDto implements Pick<Birdhouse, 'birds' | 'eggs'> {
  @IsPositive()
  birds: number;

  @IsPositive()
  eggs: number;
}
