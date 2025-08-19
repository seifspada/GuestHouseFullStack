import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';



export enum UserStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
}

export enum UserRole {
  ADMIN = 'admin',
  RESPONSABLE = 'responsable',
  USER = 'user',
}

export interface UserDocument extends User, Document {
  _id: Types.ObjectId;
}

@Schema({ timestamps: true })
export class User {
@Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  telephone: string;

  @Prop({ required: true, enum: ['user', 'responsable', 'admin'] })
  role: string;

@Prop({ required: true, enum: ['present', 'absent'], default: 'absent' })
  status: string;

  @Prop({ trim: true })
  serviceName?: string; // Required for responsible users, e.g., "bysclet"

  @Prop({ min: 0 })
  servicePrice?: number; // Required for responsible users, e.g., 50
}

export const UserSchema = SchemaFactory.createForClass(User);