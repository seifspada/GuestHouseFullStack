import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, BadRequestException, UploadedFiles } from '@nestjs/common';
import { ServiceService } from './service.service';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/user/user.controller';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ServiceType,Location } from './schemas/service.schema';
import { validate } from 'class-validator';
import * as fs from 'fs';
import { CreateServiceDto } from './dto/create-service.dto';


@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}


  
@Post()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@UseInterceptors(
  FilesInterceptor('images', 5, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './Uploads/services';
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
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }),
)
async create(
  @UploadedFiles() files: Express.Multer.File[],
  @Body() body: any,
): Promise<any> {
  // Validation manuelle des enums
  const typeMap: { [key: string]: ServiceType } = {
    wellness: ServiceType.WELLNESS,
    activity: ServiceType.ACTIVITY,
    culinary: ServiceType.CULINARY,
    transport: ServiceType.TRANSPORT,
    entertainment: ServiceType.ENTERTAINMENT, // Fixed typo from "Entretainment"
  };

  const locationMap: { [key: string]: Location } = {
    sea: Location.SEA,
    mountain: Location.MOUNTAIN,
    local: Location.LOCAL,
  };

  const mappedType = typeMap[body.type];
  const mappedLocation = locationMap[body.location];

  if (!mappedType) {
    throw new BadRequestException(`Invalid type: ${body.type}`);
  }

  if (!mappedLocation) {
    throw new BadRequestException(`Invalid location: ${body.location}`);
  }

  const host = `${process.env.BASE_URL || 'http://localhost:3000'}`;

  const createServiceDto = {
    name: body.name,
    description: body.description,
    type: mappedType,
    location: mappedLocation,
    price: parseFloat(body.price),
    duration: body.duration,
    minParticipants: parseInt(body.minParticipants, 10),
    minAge: parseInt(body.minAge, 10),
    startTime:body.startTime,
    endTime:body.endTime,
    isActive: body.isActive === 'true',
    images: files?.map(file => `${host}/Uploads/services/${file.filename}`) || [],
  };

  // Valider manuellement le DTO
  const dtoInstance = Object.assign(new CreateServiceDto(), createServiceDto);
  const errors = await validate(dtoInstance);
  if (errors.length > 0) {
    const errorMessages = errors
      .map(err => Object.values(err.constraints || {}).join(', '))
      .join('; ');
    throw new BadRequestException(`Validation failed: ${errorMessages}`);
  }

  return await this.serviceService.create(createServiceDto, files);
}







  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'user')
@Get()
findAll() {
  return this.serviceService.findAll();
}




@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','user')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }




@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }

}

  

