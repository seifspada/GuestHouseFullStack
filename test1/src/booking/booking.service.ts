import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Booking, BookingDocument, BookingStatus } from './schemas/booking.schema';
import { User, UserDocument } from '../user/schema/user.schema';
import { Bungalow } from '../bungalow/schemas/bungalow.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { v4 as uuidv4 } from 'uuid';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Bungalow.name) private bungalowModel: Model<any>,
        private  notificationService: NotificationService,  // <-- injecter

  ) {}

async createBooking(userId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
  const checkInDate = new Date(createBookingDto.checkInDate);
  const checkOutDate = new Date(createBookingDto.checkOutDate);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    throw new BadRequestException('Invalid check-in or check-out date');
  }

  if (checkOutDate <= checkInDate) {
    throw new BadRequestException('Check-out date must be after check-in date');
  }


  // Valider que l'utilisateur existe
const userExists = await this.userModel.exists({ _id: userId });
if (!userExists) throw new BadRequestException('User does not exist');


  // Valider que le bungalow existe
  const bungalowExists = await this.bungalowModel.exists({ _id: createBookingDto.bungalowId });
  if (!bungalowExists) {
    throw new BadRequestException('Bungalow does not exist');
  }
    const bookingReference = uuidv4();

  // Créer la réservation en injectant userId explicitement
  const booking = new this.bookingModel({
    ...createBookingDto,
    userId,          // injecter userId ici
     checkInDate,
    checkOutDate,
    bookingReference,  // <- Important: assigner ici !

  });

  return booking.save();
}



 

 
 async confirmBooking(id: string): Promise<Booking> {
    const booking = await this.updateBookingStatus(id, { status: BookingStatus.CONFIRMED });

    // Créer notification de confirmation
    await this.notificationService.createNotification({
      type: 'reservation',
      recipientGroup: 'specific_guest',
      specificGuestId: booking.userId.toString(), // id user à qui envoyer
      title: 'Booking Confirmed',
      message: `Your booking ${booking.bookingReference} has been confirmed.`,
      isUrgent: false,
    });

    return booking;
  }

  async rejectBooking(id: string): Promise<void> {
    // Récupérer booking avant suppression pour notification
    const booking = await this.bookingModel.findById(id);
    if (!booking) throw new NotFoundException(`Booking with ID ${id} not found`);

    // Supprimer réservation
    await this.bookingModel.findByIdAndDelete(id).exec();

    // Créer notification d’annulation
    await this.notificationService.createNotification({
      type: 'reservation',
      recipientGroup: 'specific_guest',
      specificGuestId: booking.userId.toString(),
      title: 'Booking Cancelled',
      message: `Your booking ${booking.bookingReference} has been cancelled.`,
      isUrgent: true,
    });
  }

  private async updateBookingStatus(id: string, update: Partial<Booking>): Promise<Booking> {
    const booking = await this.bookingModel.findByIdAndUpdate(id, update, { new: true });
    if (!booking) throw new NotFoundException(`Booking with ID ${id} not found`);
    return booking;
  }


    async findOne(id: string) {
      const booking = await this.bookingModel.findById(id).exec();
      if (!booking) {
        throw new HttpException('User not found', 404);
      }
      return booking;
    }

  async markNoShow(id: string): Promise<{ message: string }> {
    const result = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Booking with ID ${id} not found`);
    return { message: `Booking marked as no-show and deleted.` };
  }

   async acceptBooking(id: string): Promise<Booking> {
    return this.updateBookingStatus(id, { status: BookingStatus.CONFIRMED });
  }

  async findUsersWithPendingBookings(): Promise<User[]> {
    const userIds = await this.bookingModel
      .find({ status: BookingStatus.PENDING })
      .distinct('userId')
      .exec();
    return this.userModel.find({ _id: { $in: userIds } }).exec();
  }

  async findUsersWithConfirmedBookings(): Promise<User[]> {
    const userIds = await this.bookingModel
      .find({ status: BookingStatus.CONFIRMED })
      .distinct('userId')
      .exec();
    return this.userModel.find({ _id: { $in: userIds } }).exec();
  }

  async findUsersWithAcceptedBookings(): Promise<User[]> {
  // Récupérer les userId des bookings dont le statut est 'accepted'
  const userIds = await this.bookingModel
    .find({ status: BookingStatus.CONFIRMED })
    .distinct('userId')
    .exec();

  // Trouver les utilisateurs correspondants à ces userIds
  return this.userModel.find({ _id: { $in: userIds } }).exec();
}


async findAll(): Promise<Booking[]> {
  return this.bookingModel
    .find()
    .populate('userId', 'name')    // charge juste prénom + nom
    .populate('bungalowId', 'name')              // charge juste le nom du bungalow
    .exec();
}


async getTodayConfirmedBookings() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return this.bookingModel
      .find({
        status: 'confirmed',
        checkInDate: { $gte: startOfDay, $lte: endOfDay },
      })
      .populate('userId', 'name email telephone') // Get guest info
      .populate('bungalowId', 'name') // Get bungalow info
      .select(
        'userId bungalowId checkInDate checkOutDate numberOfNights numberOfAdults numberOfChildren totalPrice description bookingReference',
      )
      .lean();
  }

/*
  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException(`Booking with ID ${id} not found`);
    return booking;
  }*/

  async remove(id: string): Promise<{ message: string }> {
    const booking = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!booking) throw new NotFoundException(`Booking with ID ${id} not found`);
    return { message: `Booking deleted successfully.` };
  }

  async getBookedDates(bungalowId: string, startDate?: string, endDate?: string): Promise<string[]> {
    const bungalow = await this.bungalowModel.findById(bungalowId).exec();
    if (!bungalow) throw new NotFoundException(`Bungalow not found`);

    const query: any = {
      bungalowId,
      status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
    };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('Invalid date format. Use ISO 8601.');
      }

      if (start >= end) {
        throw new BadRequestException('startDate must be before endDate.');
      }

      query.$or = [
        { checkInDate: { $lte: end, $gte: start } },
        { checkOutDate: { $lte: end, $gte: start } },
        { checkInDate: { $lte: start }, checkOutDate: { $gte: end } },
      ];
    }

    const bookings = await this.bookingModel.find(query).exec();
    const bookedDates = new Set<string>();

    bookings.forEach((booking) => {
      const currentDate = new Date(booking.checkInDate);
      const end = new Date(booking.checkOutDate);
      while (currentDate < end) {
        bookedDates.add(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return Array.from(bookedDates).sort();
  }

  async findAvailableBungalows(checkInDate: string, checkOutDate: string) {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    throw new BadRequestException('Invalid date range.');
  }

  // Step 1: Find booked bungalow IDs that overlap with the requested dates
  const bookedBungalowIds = await this.bookingModel
    .find({
      status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      $or: [
        { checkInDate: { $lt: end }, checkOutDate: { $gt: start } }
      ]
    })
    .distinct('bungalowId')
    .exec();

  // Step 2: Return all bungalows NOT in the booked list
  return this.bungalowModel.find({
    _id: { $nin: bookedBungalowIds }
  }).exec();
}


 

}



/* async updateBookingStatus(id: string, dto: UpdateBookingStatusDto): Promise<Booking> {
    const validStatuses = [
      BookingStatus.PENDING,
      BookingStatus.CANCELLED,
      BookingStatus.CONFIRMED,
    ];

    if (!validStatuses.includes(dto.status as BookingStatus)) {
      throw new BadRequestException(`Invalid status: ${dto.status}`);
    }

    if (dto.status === BookingStatus.CANCELLED) {
      const deleted = await this.bookingModel.findByIdAndDelete(id).exec();
      if (!deleted) throw new NotFoundException(`Booking with ID ${id} not found`);
      throw new BadRequestException(`Booking rejected and deleted`);
    }

    const booking = await this.bookingModel.findByIdAndUpdate(
      id,
      { status: dto.status },
      { new: true },
    ).exec();

    if (!booking) throw new NotFoundException(`Booking with ID ${id} not found`);
    return booking;
  } */