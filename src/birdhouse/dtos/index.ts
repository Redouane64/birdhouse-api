import {
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsPositive,
  Length,
} from 'class-validator';
import { Birdhouse } from '../interfaces/birdhouse.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterBirdhouseDto
  implements Pick<Birdhouse, 'name' | 'latitude' | 'longitude'>
{
  @ApiProperty()
  @Length(4, 16)
  name: string;

  @ApiProperty()
  @IsLatitude()
  latitude: number;

  @ApiProperty()
  @IsLongitude()
  longitude: number;
}

export class UpdateBirdhouseDto
  implements Partial<Pick<Birdhouse, 'name' | 'latitude' | 'longitude'>>
{
  @ApiPropertyOptional()
  @IsOptional()
  @Length(4, 16)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsLongitude()
  longitude?: number;
}

export class AddOccupancyDto implements Pick<Birdhouse, 'birds' | 'eggs'> {
  @ApiProperty()
  @IsPositive()
  birds: number;

  @ApiProperty()
  @IsPositive()
  eggs: number;
}
