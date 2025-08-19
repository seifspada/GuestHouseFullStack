import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Schema({ timestamps: true })
export class ServiceUsage extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId; // Client (role: 'user')

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  responsable: Types.ObjectId; // Responsible user (role: 'responsable')

  @Prop({ required: true, trim: true })
  serviceName: string; // Service name from responsible user, e.g., "bysclet"

  @Prop({ required: true, min: 0 })
  servicePrice: number; // Price per 30 minutes from responsible user, e.g., 50

  // Selected duration in minutes (e.g., 30, 60, 90, 120)
  @Prop({ required: true, enum: [30, 60, 90, 120] })
  duration: number;

  // Calculated total price = (duration / 30) * servicePrice
  @Prop({ required: true })
  totalPrice: number;

  @Prop({ type: String, trim: true })
  notes?: string;

  @Prop({ default: Date.now })
  usageTime: Date;
}

export const ServiceUsageSchema = SchemaFactory.createForClass(ServiceUsage);