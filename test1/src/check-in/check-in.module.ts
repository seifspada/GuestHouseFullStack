import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckIn, CheckInSchema } from './schemas/check-in.schema';
import { CheckInService } from './check-in.service';
import { CheckInController } from './check-in.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Booking, BookingSchema } from '../booking/schemas/booking.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: CheckIn.name, schema: CheckInSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: User.name, schema: UserSchema }, // Added User schema
    ]),
  ],
  providers: [CheckInService],
  controllers: [CheckInController],
  exports: [CheckInService],
})
export class CheckInModule {}