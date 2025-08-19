import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsArray } from 'class-validator';
import { Category } from '../schemas/food.schema';

export class UpdateFoodDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(Category)
  @IsOptional()
  category?: Category;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsNumber()
  @IsOptional()
  spiceLevel?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsString()
  @IsOptional()
  preparationTime?: string;
}
