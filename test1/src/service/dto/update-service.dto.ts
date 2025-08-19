import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';
import { ServiceType,Location } from '../schemas/service.schema';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {


@IsString()
@IsOptional()

name?: string;

@IsString()
@IsOptional()

description?: string;

@IsEnum(ServiceType)
@IsOptional()
type?: ServiceType;

@IsNumber()
@IsOptional()
@Min(0)
price?: number;

@IsString()
@IsOptional()
duration?: string;



 @IsOptional()
  @IsNumber()
  @Min(1)
  minParticipants?: number;


 @IsOptional()
  @IsNumber()
  @Min(0)
  minAge?: number;

 @IsOptional()
   @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime must be in HH:mm format (e.g., 12:00)' })
  startTime?: string;

  // End time of the service in HH:mm format (e.g., 14:00)
   @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'endTime must be in HH:mm format (e.g., 14:00)' })
  endTime?: string;

  @IsOptional()
  @IsEnum(Location)
  location?: Location;

@IsOptional()
@IsArray()
@IsString({ each: true })
images?: string[];

@IsBoolean()
@IsOptional()
isActive?: boolean;

}
