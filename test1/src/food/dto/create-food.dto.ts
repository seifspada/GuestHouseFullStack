// src/food/dto/create-food.dto.ts
import { IsString, IsEnum, IsNumber, Min, Max, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { Category } from '../schemas/food.schema';

export class CreateFoodDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(Category)
  category: Category;

  @IsNumber()
  @Min(0)
  price: number;

@IsOptional()
@IsArray()
@IsString({ each: true })
images?: string[];


  @IsString()
  @IsOptional()
  preparationTime?: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  spiceLevel?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}