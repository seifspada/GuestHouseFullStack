import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

export enum ServiceType {
  ACTIVITY = 'activity',
  WELLNESS = 'wellness',
  CULINARY = 'culinary',
  TRANSPORT = 'transport',
  ENTERTAINMENT = 'entertainment',
}

export enum Location {
  SEA = 'sea',
  MOUNTAIN = 'mountain',
  LOCAL = 'local'
}

@Schema({ timestamps: true })
export class Service extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, enum: ServiceType, default: ServiceType.ACTIVITY })
  type: ServiceType;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({ required: true })
  duration: string;

  @Prop({ type: Number, required: true, min: 1 })
  minParticipants: number;

  @Prop({ type: Number, required: true, min: 0 })
  minAge: number;

  @Prop({ required: true, enum: Location })
  location: Location;

  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Validates HH:mm format
  })
  startTime: string;

  // End time of the service in HH:mm format (e.g., 14:00)
  @Prop({
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Validates HH:mm format
  })
  endTime: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);