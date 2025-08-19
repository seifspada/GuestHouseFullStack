// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServiceModule } from './service/service.module';
import { BungalowModule } from './bungalow/bungalow.module';
import { FoodModule } from './food/food.module';
import { BookingModule } from './booking/booking.module';
import { ReviewModule } from './review/review.module';
import { NotificationModule } from './notification/notification.module';
import { ServiceUsageModule } from './service-usage/service-usage.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CheckInModule } from './check-in/check-in.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/guestHouse',
      }),
      inject: [ConfigService],
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    AuthModule,
    UserModule,
    ServiceModule,
    BungalowModule,
    FoodModule,
    BookingModule,
    ReviewModule,
    NotificationModule,
    ServiceUsageModule,
    CheckInModule,
  ],
})
export class AppModule {}
