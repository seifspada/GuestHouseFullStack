import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CheckInDocument = CheckIn & Document;

@Schema({ timestamps: true })
export class CheckIn {
  // Référence vers la réservation confirmée

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;


  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  bookingId: Types.ObjectId;

  @Prop({ required: true })
  arrivalTime: string;

  @Prop()
  parkingAssigned?: string;

  @Prop({ default: false })
  roomReady: boolean;

  @Prop({ default: false })
  keyIssued: boolean;

  @Prop()
  notes?: string;

  @Prop()
  actualArrival?: Date; // optionnel pour date précise
}

export const CheckInSchema = SchemaFactory.createForClass(CheckIn);
