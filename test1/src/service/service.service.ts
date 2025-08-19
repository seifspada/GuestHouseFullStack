import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument, Service as ServiceSchema } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(@InjectModel(Service.name) private serviceModel: Model<ServiceDocument>) {}


  
async create(createServiceDto: CreateServiceDto, imageFiles?: Express.Multer.File[]): Promise<Service> {
  try {
    const imageNames = imageFiles?.map(file => file.filename) ?? [];
    const createdService = new this.serviceModel({
      ...createServiceDto,
      images: imageNames,
      isActive: createServiceDto.isActive ?? true,
    });
    return await createdService.save();
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(
        (err: any) => `${err.path}: ${err.message}`,
      );
      throw new BadRequestException(`Validation failed: ${errors.join('; ')}`);
    }
    throw new InternalServerErrorException('Failed to create service: ' + error.message);
  }
}



async findAll(): Promise<any[]> {
  const services = await this.serviceModel.find().exec();

  const fullServices = services.map(service => {
    const serviceObj = service.toObject();
    const firstImage = serviceObj.images?.[0];
    return {
      ...serviceObj,
      image: firstImage
        ? `http://localhost:3000/uploads/services/${firstImage}`
        : 'assets/default-food-image.jpg',
    };
  });

  return fullServices;
}




async findOne(id: string): Promise<any> {
  const service = await this.serviceModel.findById(id).exec();

  if (!service) {
    throw new NotFoundException(`Service with ID ${id} not found`);
  }

  const serviceObj = service.toObject();
  const firstImage = serviceObj.images?.[0];

  return {
    ...serviceObj,
    image: firstImage
      ? `http://localhost:3000/uploads/services/${firstImage}`
      : 'assets/default-food-image.jpg',
  };
}




async remove(id: string): Promise<{ message: string }> {
    const result = await this.serviceModel
      .findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true })
      .exec();
    if (!result) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return { message: `Service with ID ${id} has been successfully deleted` };
  }




}