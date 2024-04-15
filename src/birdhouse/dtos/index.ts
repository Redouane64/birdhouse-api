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

export class RegisterBirdhouseResponse implements Birdhouse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ubid: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  birds: number;

  @ApiProperty()
  eggs: number;
}

export class BirdhouseResponse implements Omit<Birdhouse, 'id'> {
  @ApiProperty()
  name: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  ubid: string;

  @ApiProperty()
  birds: number;

  @ApiProperty()
  eggs: number;
}
