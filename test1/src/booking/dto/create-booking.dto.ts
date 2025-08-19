import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus } from '../schemas/booking.schema';

export class CreateBookingDto {
  // Remove userId from client input
  // userId will be set server-side from JWT token

  @IsString()
  @IsNotEmpty()
  bungalowId: string;

  @IsDateString()
  @IsNotEmpty()
  checkInDate: string;

  @IsDateString()
  @IsNotEmpty()
  checkOutDate: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  numberOfNights: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  numberOfAdults: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  numberOfChildren: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  totalPrice: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus;
}
