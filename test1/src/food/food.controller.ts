import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors, InternalServerErrorException, BadRequestException, ValidationPipe, UploadedFiles, UsePipes } from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/user/user.controller';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Category, Food } from './schemas/food.schema';
import * as fs from 'fs';
import { validate } from 'class-validator';


@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}
// src/food/food.controller.ts
// src/food/food.controller.ts



@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@UseInterceptors(
  FilesInterceptor('images', 5, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './uploads/foods';
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const ext = extname(file.originalname).toLowerCase();
      if (allowedTypes.test(ext)) {
        cb(null, true);
      } else {
        cb(
          new BadRequestException('Invalid file type. Only JPEG, PNG, and GIF are allowed.'),
          false,
        );
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  }),
)
async create(
  @UploadedFiles() files: Express.Multer.File[],
  @Body() body: any,
): Promise<Food> {
  const categoryMap: { [key: string]: Category } = {
    Breakfast: Category.BREAKFAST,
    Dinner: Category.DINNER,
    Dessert: Category.DESSERT,
    Drink: Category.DRINK,
  };

  const mappedCategory = categoryMap[body.category];
  if (!mappedCategory) {
    throw new BadRequestException(`Invalid category: ${body.category}`);
  }

  const host = `${process.env.BASE_URL || 'http://localhost:3000'}`;

  const createFoodDto = {
    name: body.name,
    description: body.description,
    category: mappedCategory,
    price: parseFloat(body.price),
    preparationTime: body.preparationTime || undefined,
    spiceLevel: body.spiceLevel ? parseInt(body.spiceLevel, 10) : undefined,
    isAvailable: body.isAvailable === 'true',
    images: files?.map(file => `${host}/uploads/foods/${file.filename}`) || [],
  };

  const dtoInstance = Object.assign(new CreateFoodDto(), createFoodDto);
  const errors = await validate(dtoInstance);
  if (errors.length > 0) {
    const errorMessages = errors
      .map(err => Object.values(err.constraints || {}).join(', '))
      .join('; ');
    throw new BadRequestException(`Validation failed: ${errorMessages}`);
  }

  // ✅ PASSER LES FICHIERS ICI :
  return await this.foodService.create(createFoodDto, files);
}




  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'user')
@Get()
findAll() {
  return this.foodService.findAll();
}




@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','user')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodService.findOne(id);
  }




@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodService.remove(id);
  }



  
  
@UseGuards(JwtAuthGuard, RolesGuard)
@Patch(':id')
@Roles('admin')
@UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
@UseInterceptors(
  FilesInterceptor('images', 5, {
    storage: diskStorage({
      destination: './uploads/foods',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const ext = extname(file.originalname).toLowerCase();
      if (allowedTypes.test(ext)) {
        cb(null, true);
      } else {
        cb(
          new BadRequestException('Invalid file type. Only JPEG, PNG, and GIF are allowed.'),
          false
        );
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  })
)
async update(
  @Param('id') id: string,
  @UploadedFiles() files: Express.Multer.File[] = [],
  @Body() body: Partial<CreateFoodDto> = {},
): Promise<Food> {
  console.log('Received body:', body); // Log incoming body
  const host = `${process.env.BASE_URL || 'http://localhost:3000'}`;

  // Construct DTO with file paths
  const updateFoodDto: Partial<CreateFoodDto> = {
    name: body.name,
    description: body.description,
    category: body.category,
    price: body.price,
    preparationTime: body.preparationTime,
    spiceLevel: body.spiceLevel,
    isAvailable: body.isAvailable,
    images: files?.map(file => `${host}/uploads/foods/${file.filename}`) || [],
  };

  console.log('Constructed updateFoodDto:', updateFoodDto); // Log DTO before validation

  // Validate DTO
  const dtoInstance = Object.assign(new CreateFoodDto(), updateFoodDto);
  const errors = await validate(dtoInstance);
  if (errors.length > 0) {
    const errorMessages = errors
      .map(err => Object.values(err.constraints || {}).join(', '))
      .join('; ');
    throw new BadRequestException(`Validation failed: ${errorMessages}`);
  }

  console.log('Validated updateFoodDto:', updateFoodDto); // Log DTO after validation

  // Call service
  return await this.foodService.update(id, updateFoodDto, files);
}

}
