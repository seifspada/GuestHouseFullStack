import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Nouvelle interface adaptée à ton besoin


@Schema({ timestamps: true })
export class Bungalow extends Document {



@Prop({ required: true, trim: true })
  name: string;

 @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;


@Prop({ required: true, min: 1 })
  maxOccupancy: number;

@Prop({ required: true, min: 1 }) 
 beds?: number;

@Prop({ required: true, min: 1 })
  baths?: number;


@Prop({ default: true })
popular?: boolean;



@Prop({ default: true })
isAvailable?: boolean;


  @Prop({required: true})
  area?: string;



 @Prop({ type: [String], default: [] })
images?: string[];
}

export const BungalowSchema = SchemaFactory.createForClass(Bungalow);