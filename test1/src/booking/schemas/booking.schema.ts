import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  CHECKED_IN = 'checked-in',
}

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Bungalow', required: true })
  bungalowId: Types.ObjectId;

  @Prop({ required: true, type: Date })
  checkInDate: Date;

  @Prop({ required: true, type: Date })
  checkOutDate: Date;

  @Prop({ required: true, min: 1 })
  numberOfNights: number;

  @Prop({ required: true, min: 1 })
  numberOfAdults: number;

  @Prop({ required: true, min: 0 })
  numberOfChildren: number;

  @Prop({ required: true, min: 0 })
  totalPrice: number;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Prop({ type: String, unique: true, required: true, default: () => uuidv4() })
  bookingReference: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Optionally add a pre-save to ensure bookingReference exists (safety)
BookingSchema.pre('save', function(next) {
  if (!this.bookingReference) this.bookingReference = uuidv4();
  next();
});
