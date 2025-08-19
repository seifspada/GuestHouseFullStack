import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, Food, FoodDocument } from './schemas/food.schema';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Express } from 'express';
import { join } from 'path';

// FoodService
@Injectable()
export class FoodService {
  constructor(@InjectModel(Food.name) private foodModel: Model<FoodDocument>) {}


async create(createFoodDto: CreateFoodDto, imageFiles?: Express.Multer.File[]): Promise<Food> {
  try {
    const imageNames = imageFiles?.map(file => file.filename) ?? [];

    const createdFood = new this.foodModel({
      ...createFoodDto,
      images: imageNames,
      isAvailable: createFoodDto.isAvailable ?? true,
      spiceLevel: createFoodDto.spiceLevel ?? 0,
    });

    return await createdFood.save();
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(
        (err: any) => `${err.path}: ${err.message}`,
      );
      throw new BadRequestException(`Validation failed: ${errors.join('; ')}`);
    }

    throw new InternalServerErrorException('Failed to create food item: ' + error.message);
  }
}




async findAll(): Promise<Food[]> {
  const foods = await this.foodModel.find().exec();

  const fullFoods = foods.map(food => {
    const foodObj = food.toObject();
    const firstImage = foodObj.images?.[0]; // Déjà chemin complet
    return {
      ...foodObj,
      image: firstImage || 'assets/default-food-image.jpg', // si vide
    };
  });

  return fullFoods;
}



 async findOne(id: string): Promise<Food> {
  const food = await this.foodModel.findById(id).exec();

  if (!food) {
    throw new NotFoundException(`Food with ID ${id} not found`);
  }

  // Ajoute le chemin complet à l'image, comme dans findAll
  const fullFood = {
    ...food.toObject(),
    image: `http://localhost:3000/uploads/foods/${food.images}`,
  };

  return fullFood;
}




async remove(id: string): Promise<{ message: string }> {
    const result = await this.foodModel
      .findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true })
      .exec();
    if (!result) {
      throw new NotFoundException(`Food with ID ${id} not found`);
    }
    return { message: `Food with ID ${id} has been successfully deleted` };
  }


  async update(
    id: string,
    updateFoodDto: Partial<CreateFoodDto>,
    imageFiles?: Express.Multer.File[],
  ): Promise<Food> {
    try {
      const existingFood = await this.foodModel.findById(id);
      if (!existingFood) {
        throw new NotFoundException(`Food item with ID ${id} not found`);
      }

      console.log('Service received updateFoodDto:', updateFoodDto); // Log DTO

      const body = updateFoodDto;

      // Handle category mapping
      let mappedCategory: Category | undefined = undefined;
      if (body && body.category) {
        const categoryMap: { [key: string]: Category } = {
          Breakfast: Category.BREAKFAST,
          Dinner: Category.DINNER,
          Dessert: Category.DESSERT,
          Drink: Category.DRINK,
        };
        mappedCategory = categoryMap[body.category];
        if (!mappedCategory) {
          throw new BadRequestException(`Invalid category: ${body.category}`);
        }
      }

      // Handle images
      const imageNames = imageFiles?.map(file => file.filename) ?? body.images ?? [];
      if (imageNames.length > 0) {
        existingFood.images = imageNames;
      }

      // Update fields
      existingFood.name = body.name ?? existingFood.name;
      existingFood.description = body.description ?? existingFood.description;
      existingFood.category = mappedCategory ?? existingFood.category;
      existingFood.price = body.price ?? existingFood.price;
      existingFood.preparationTime = body.preparationTime ?? existingFood.preparationTime;
      existingFood.spiceLevel = body.spiceLevel ?? existingFood.spiceLevel;
      existingFood.isAvailable = body.isAvailable ?? existingFood.isAvailable;

      console.log('Updated food document before save:', existingFood); // Log document before saving

      const updatedFood = await existingFood.save();
      console.log('Updated food document after save:', updatedFood); // Log document after saving

      return updatedFood;
    } catch (error) {
      console.error('Error updating food item:', error); // Log errors
      throw new InternalServerErrorException('Failed to update food item: ' + error.message);
    }
  }


}