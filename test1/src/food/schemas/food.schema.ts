// src/food/schemas/food.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FoodDocument = Food & Document;

// src/food/schemas/food.schema.ts
export enum Category {
  BREAKFAST = 'Breakfast',
  DINNER = 'Dinner',
  DESSERT = 'Dessert',
  DRINK = 'Drink',
}


@Schema({ timestamps: true })
export class Food {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, enum: Category })
  category: Category;

  @Prop({ required: true, min: 0 })
  price: number;

@Prop({ type: [String], default: [] })
images?: string[];

  @Prop({ required: false, trim: true })
  preparationTime?: string;

  @Prop({ min: 0, max: 5, default: 0 })
  spiceLevel?: number;

  @Prop({ default: true })
  isAvailable?: boolean;
}

export const FoodSchema = SchemaFactory.createForClass(Food);