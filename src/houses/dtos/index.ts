import {
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsPositive,
  Length,
  Min,
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
  name?: string;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;
}

export class AddOccupancyDto implements Pick<Birdhouse, 'birds' | 'eggs'> {
  @IsPositive()
  @Min(0)
  birds: number;

  @IsPositive()
  @Min(0)
  eggs: number;
}
