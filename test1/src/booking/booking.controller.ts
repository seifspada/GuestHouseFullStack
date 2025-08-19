import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  HttpCode,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Request } from '@nestjs/common';
import { BookingService } from './booking.service';
import {  CreateBookingDto } from './dto/create-booking.dto';
import { Booking, BookingStatus } from './schemas/booking.schema';
import { User } from '../user/schema/user.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/user/user.controller';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
@Post('/sendBooking')
async createBooking(@Request() req, @Body() body: any): Promise<any> {
  try {
    const createBookingDto: CreateBookingDto = {
      bungalowId: body.bungalowId,
      checkInDate: body.checkInDate,
      checkOutDate: body.checkOutDate,
      numberOfNights: parseInt(body.numberOfNights, 10),
      numberOfAdults: parseInt(body.numberOfAdults, 10),
      numberOfChildren: parseInt(body.numberOfChildren, 10),
      totalPrice: parseFloat(body.totalPrice),
      description: body.description || undefined,
      status: body.status,
    };

    const errors = await this.validateDto(createBookingDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return await this.bookingService.createBooking(req.user.id, createBookingDto);
  } catch (err) {
    console.error('Create booking error:', err);
    throw err; // rethrow so Nest can handle it
  }
}


 private async validateDto(dto: CreateBookingDto): Promise<string[]> {
  const errors: string[] = [];
  const {
    bungalowId,
    checkInDate,
    checkOutDate,
    numberOfNights,
    numberOfAdults,
    numberOfChildren,
    totalPrice,
    status,
  } = dto;

  // Removed userId check, handled elsewhere

  if (!bungalowId) errors.push('bungalowId is required');
  if (!checkInDate || isNaN(Date.parse(checkInDate)))
    errors.push('checkInDate must be a valid ISO date');
  if (!checkOutDate || isNaN(Date.parse(checkOutDate)))
    errors.push('checkOutDate must be a valid ISO date');
  if (isNaN(numberOfNights) || numberOfNights < 1)
    errors.push('numberOfNights must be a number >= 1');
  if (isNaN(numberOfAdults) || numberOfAdults < 1)
    errors.push('numberOfAdults must be a number >= 1');
  if (isNaN(numberOfChildren) || numberOfChildren < 0)
    errors.push('numberOfChildren must be a number >= 0');
  if (isNaN(totalPrice) || totalPrice < 0)
    errors.push('totalPrice must be a number >= 0');
  if (!Object.values(BookingStatus).includes(status))
    errors.push('status must be one of: pending, confirmed, cancelled');

  return errors;
}


  

 @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

 @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
    @Get('today-arrivals')
  async getTodayArrivals() {
    return this.bookingService.getTodayConfirmedBookings();
  }


@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/confirm')
  async confirm(@Param('id') id: string): Promise<Booking> {
    return this.bookingService.confirmBooking(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id/reject')
  @HttpCode(204) // No Content
  async reject(@Param('id') id: string): Promise<void> {
        await this.bookingService.rejectBooking(id);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','user')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }




  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.bookingService.remove(id);
  }

 
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/accept')
  async accept(@Param('id') id: string): Promise<Booking> {
    return this.bookingService.acceptBooking(id);
  }


@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id/no-show')
  async markNoShow(@Param('id') id: string): Promise<{ message: string }> {
    return this.bookingService.markNoShow(id);
  }
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('users/pending')
async getUsersWithPendingBookings(): Promise<User[]> {
  return this.bookingService.findUsersWithPendingBookings();
}

@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('users/confirmed')
  async getUsersWithConfirmedBookings(): Promise<User[]> {
    return this.bookingService.findUsersWithConfirmedBookings();
  }
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('users/accepted')
async getUsersWithAcceptedBookings(): Promise<User[]> {
  return this.bookingService.findUsersWithAcceptedBookings();
}

@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','user')
  @Get('bungalow/:id/booked-dates')
  async getBookedDates(
    @Param('id') bungalowId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<string[]> {
    return this.bookingService.getBookedDates(bungalowId, startDate, endDate);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','user')
  @Get('available')
async findAvailableBungalows(
  @Query('checkIn') checkIn: string,
  @Query('checkOut') checkOut: string
) {
  return this.bookingService.findAvailableBungalows(checkIn, checkOut);
}

}
