import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import { CheckIn, CheckInDocument } from './schemas/check-in.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument, BookingStatus } from 'src/booking/schemas/booking.schema';
import { User, UserDocument, UserStatus } from 'src/user/schema/user.schema';

@Injectable()
export class CheckInService {
  find() {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckInDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,

  ) {}

  async create(userId: string, userRole: string, createCheckInDto: CreateCheckInDto) {
    // 1. Vérifier que la réservation (booking) existe
    const booking = await this.bookingModel.findById(createCheckInDto.bookingId);
    if (!booking) throw new NotFoundException('Booking not found');

    // 2. Vérifier que l'utilisateur est admin ou le propriétaire de la réservation
    if (userRole !== 'admin' && booking.userId.toString() !== userId) {
      throw new UnauthorizedException("You cannot check in for another user's booking");
    }

    // 3. Créer le check-in en injectant le userId
    const newCheckIn = new this.checkInModel({
      ...createCheckInDto,
      userId,
    });

    // 4. Mettre à jour le statut de l'utilisateur à 'present'
    await this.userModel.findByIdAndUpdate(userId, { status: UserStatus.PRESENT });

    // 5. Sauvegarder en base et retourner le résultat
    return newCheckIn.save();
  }

  
     async getAllPresentUsers(): Promise<UserDocument[]> {
      return this.userModel.find({ status: UserStatus.PRESENT }).exec();
    }
  



  // check-in.service.ts
async findAllDetailed() {
  return this.checkInModel
    .find()
    .populate({
      path: 'bookingId',      // suppose que tu as bookingId dans CheckIn
      select: 'checkInDate checkOutDate numberOfNights numberOfAdults numberOfChildren totalPrice bungalowId',
      populate: [{            // pour avoir les infos bungalow dans booking
        path: 'bungalowId',
        select: 'name ' // ce que tu veux afficher du bungalow
      },
      {
        path:'userId',
        select:'name telephone email'
      }
    ]
    })
    .exec();
}



// check-in.service.ts
async findAll(): Promise<CheckIn[]> {
    return this.checkInModel
      .find()
      .populate('userId', 'name email')    // adapte les champs selon ton User schema
      .populate('bookingId', 'checkInDate checkOutDate') // adapte selon Booking schema
      .exec();
  }




  findOne(id: number) {
    return `This action returns a #${id} checkIn`;
  }

  update(id: number, updateCheckInDto: UpdateCheckInDto) {
    return `This action updates a #${id} checkIn`;
  }

  remove(id: number) {
    return `This action removes a #${id} checkIn`;
  }
}
