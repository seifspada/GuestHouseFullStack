import { IsArray, IsEnum, IsNumber, IsString, Min, IsOptional, IsBoolean, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { ServiceType, Location } from '../schemas/service.schema';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(ServiceType, { message: 'Invalid type: $value' })
  type: ServiceType;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  duration: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  minParticipants: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(0)
  minAge: number;

  @IsEnum(Location, { message: 'Invalid location: $value' })
  location: Location;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

   @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime must be in HH:mm format (e.g., 12:00)' })
  startTime: string;

  // End time of the service in HH:mm format (e.g., 14:00)
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'endTime must be in HH:mm format (e.g., 14:00)' })
  endTime: string;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive: boolean;
}