import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseInterceptors,
  UploadedFiles,
  UsePipes,
  ValidationPipe,
  InternalServerErrorException,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { BungalowService } from './bungalow.service';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/user/user.controller';
import { Bungalow } from './schemas/bungalow.schema';
import { UpdateBungalowDto } from './dto/update-bungalow.dto';
import * as fs from 'fs';
import { CreateBungalowDto } from './dto/create-bungalow.dto';
import { validate } from 'class-validator';

@Controller('bungalows')
export class BungalowController {
  constructor(private bungalowService: BungalowService) {}

  
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/bungalows';
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
  ): Promise<Bungalow> {
   
  
  
  
    const host = `${process.env.BASE_URL || 'http://localhost:3000'}`;
  
    const createBungalowDto = {
      name: body.name,
      description: body.description,
      price: parseFloat(body.price),
      beds: parseFloat(body.beds),
      baths: parseFloat(body.baths),
      maxOccupancy: parseFloat(body.maxOccupancy),
      
      area: body.area,
      isAvailable: body.isAvailable === 'true',
      popular: body.popular === 'true',
      images: files?.map(file => `${host}/uploads/bungalows/${file.filename}`) || [],
    };
  
    const dtoInstance = Object.assign(new CreateBungalowDto(), createBungalowDto);
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      const errorMessages = errors
        .map(err => Object.values(err.constraints || {}).join(', '))
        .join('; ');
      throw new BadRequestException(`Validation failed: ${errorMessages}`);
    }
  
    // ✅ PASSER LES FICHIERS ICI :
return await this.bungalowService.create(dtoInstance, files);
  }
  
  



  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'user')
@Get()
findAll() {
  return this.bungalowService.findAll();
}



  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','user')
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Bungalow> {
    return this.bungalowService.findOne(id);
  }




  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.bungalowService.remove(id);
  }
}