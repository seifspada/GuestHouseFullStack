import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateCheckInDto {
  @IsString()
  @IsNotEmpty()
  bookingId: string;



  @IsString()
  @IsNotEmpty()
  arrivalTime: string;

  @IsOptional()
  @IsString()
  parkingAssigned?: string;

  @IsBoolean()
  roomReady: boolean;

  @IsBoolean()
  keyIssued: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  
}
