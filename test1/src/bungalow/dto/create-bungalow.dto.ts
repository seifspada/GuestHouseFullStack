// src/food/dto/create-food.dto.ts
import { IsString, IsEnum, IsNumber, Min, Max, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateBungalowDto {
  @IsString()
  name: string;

  @IsString()
  description: string;


  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  maxOccupancy: number;

  @IsNumber()
  @Min(1)
  baths: number;

   @IsNumber()
  @Min(1)
  beds: number;


  @IsString()
  area:string;

  @IsBoolean()
  @IsOptional()
  popular?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;


  @IsOptional()
@IsArray()
@IsString({ each: true })
images?: string[];

}