import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResponsableDocument = Responsable & Document;

@Schema({ timestamps: true })
export class Responsable {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop()
  telephone: string;

  @Prop()
  serviceName: string;

  @Prop({ type: Number })
  servicePrice: number;
}

export const ResponsableSchema = SchemaFactory.createForClass(Responsable);