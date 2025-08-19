import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bungalow } from './schemas/bungalow.schema';
import { Booking, BookingDocument } from '../booking/schemas/booking.schema';
import { CreateBungalowDto } from './dto/create-bungalow.dto';
import { UpdateBungalowDto } from './dto/update-bungalow.dto';
import { BookingStatus } from '../booking/schemas/booking.schema';

@Injectable()
export class BungalowService {
  constructor(
    @InjectModel(Bungalow.name) private bungalowModel: Model<Bungalow>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}


  
async create(createBungalowDto: CreateBungalowDto, imageFiles?: Express.Multer.File[]): Promise<Bungalow> {
  try {
    const imageNames = imageFiles?.map(file => file.filename) ?? [];
    const createdBungalow = new this.bungalowModel({
      ...createBungalowDto,
      images: imageNames,
      isAvailable: createBungalowDto.isAvailable ?? true,
      popular: createBungalowDto.popular ?? true,
    });
    return await createdBungalow.save();
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(
        (err: any) => `${err.path}: ${err.message}`,
      );
      throw new BadRequestException(`Validation failed: ${errors.join('; ')}`);
    }
    throw new InternalServerErrorException('Failed to create bungalow: ' + error.message);
  }
}



async findAll(): Promise<any[]> {
  const bungalows = await this.bungalowModel.find().exec();

  const imageBaseUrl = 'http://localhost:3000/uploads/bungalows/';

  return bungalows.map(bungalow => {
    const bungalowObj = bungalow.toObject();
    const firstImage = bungalowObj.images?.[0];

    return {
      ...bungalowObj,
      image: firstImage
        ? `${imageBaseUrl}${firstImage}`
        : 'assets/default-food-image.jpg',
    };
  });
}




async findOne(id: string): Promise<any> {
  const bungalow = await this.bungalowModel.findById(id).exec();

  if (!bungalow) {
    throw new NotFoundException(`Bungalow with ID ${id} not found`);
  }

  const bungalowObj = bungalow.toObject();

  const imageBaseUrl = 'http://localhost:3000/uploads/bungalows/';

  return {
    ...bungalowObj,
    images: bungalowObj.images?.map((img: string) => `${imageBaseUrl}${img}`) || [],
  };
}




async remove(id: string): Promise<{ message: string }> {
    const result = await this.bungalowModel
      .findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true })
      .exec();
    if (!result) {
      throw new NotFoundException(`Bungalow with ID ${id} not found`);
    }
    return { message: `Bungalow with ID ${id} has been successfully deleted` };
  }


  async findAvailableBungalows(
    startDate: Date,
    endDate: Date,
  ): Promise<Bungalow[]> {
    const bookedBungalows = await this.bookingModel
      .find({
        status: {
          $in: [
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
            BookingStatus.CANCELLED,
          ],
        },
        $or: [
          {
            checkInDate: { $lte: endDate, $gte: startDate },
          },
          {
            checkOutDate: { $lte: endDate, $gte: startDate },
          },
          {
            checkInDate: { $lte: startDate },
            checkOutDate: { $gte: endDate },
          },
        ],
      })
      .distinct('bungalowId')
      .exec();

    return this.bungalowModel
      .find({
        isActive: true,
        isAvailable: true,
        _id: { $nin: bookedBungalows },
      })
      .exec();
  }
}






 /*async create(createBungalowDto: CreateBungalowDto): Promise<Bungalow> {
    const createdBungalow = new this.bungalowModel(createBungalowDto);
    return createdBungalow.save();
  }*/