import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Food, FoodSchema } from './schemas/food.schema';
import { AuthModule } from 'src/auth/auth.module';
import { FoodController } from './food.controller';


@Module({

   imports: [AuthModule,
    MongooseModule.forFeature([{ name: Food.name, schema: FoodSchema }]),
  ],
  controllers: [FoodController],
  providers: [FoodService],
    exports: [FoodService],

})
export class FoodModule {}

