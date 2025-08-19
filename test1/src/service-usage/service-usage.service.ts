import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceUsage } from './schemas/service-usage.schema';
import { CreateServiceUsageDto } from './dto/create-service-usage.dto';
import { User, UserDocument } from '../user/schema/user.schema';

@Injectable()
export class ServiceUsageService {
  constructor(
    @InjectModel(ServiceUsage.name) private readonly usageModel: Model<ServiceUsage>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createDto: CreateServiceUsageDto): Promise<ServiceUsage> {
    // Validate client (user)
    const user = await this.userModel.findById(createDto.user).exec();
    if (!user || user.role !== 'user' || user.status !== 'present') {
      throw new BadRequestException('Client is not present, does not exist, or is not a user');
    }

    // Validate responsible user
    const responsable = await this.userModel.findById(createDto.responsable).exec();
    if (!responsable || responsable.role !== 'responsable') {
      throw new BadRequestException('Responsible user does not exist or is not a responsable');
    }
    if (!responsable.serviceName || responsable.servicePrice == null) {
      throw new BadRequestException('Responsible user must have a serviceName and servicePrice');
    }

    // Calculate total price: (duration / 30) * servicePrice
    const totalPrice = (createDto.duration / 30) * responsable.servicePrice;

    // Create service usage
    const serviceUsage = new this.usageModel({
      ...createDto,
      serviceName: responsable.serviceName,
      servicePrice: responsable.servicePrice,
      totalPrice,
      usageTime: new Date(),
    });

    return serviceUsage.save();
  }

  async findPresentUsers(): Promise<User[]> {
    return this.userModel.find({ status: 'present', role: 'user' }).exec();
  }

  async findAllByUser(userId: string): Promise<ServiceUsage[]> {
    return this.usageModel
      .find({ user: userId })
      .populate('user responsable')
      .exec();
  }

  async findAll(): Promise<ServiceUsage[]> {
    return this.usageModel
      .find()
      .populate('user responsable')
      .exec();
  }
}