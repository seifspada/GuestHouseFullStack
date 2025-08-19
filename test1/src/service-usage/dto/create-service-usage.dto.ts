import { IsMongoId, IsNumber, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateServiceUsageDto {
  @IsMongoId()
  user: string; // Client ID

  @IsMongoId()
  responsable: string; // Responsible user ID

  @IsNumber()
  @IsIn([30, 60, 90, 120])
  duration: number; // Duration in minutes

  @IsOptional()
  @IsString()
  notes?: string; // Optional notes
}