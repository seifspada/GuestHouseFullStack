import { Controller, Post, Body, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ServiceUsageService } from './service-usage.service';
import { CreateServiceUsageDto } from './dto/create-service-usage.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../user/user.controller';

@Controller('services-usage')
export class ServiceUsageController {
  constructor(private readonly usageService: ServiceUsageService) {}

  // Create a service usage (restricted to responsable)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('responsable')
  @Post()
  async createServiceUsage(@Body() createDto: CreateServiceUsageDto) {
    try {
      const created = await this.usageService.create(createDto);
      return created;
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to create service usage');
    }
  }

  // Get all service usages (restricted to responsable)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('responsable')
  @Get()
  async findAll() {
    return this.usageService.findAll();
  }

  // Get service usages by user ID (restricted to responsable)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('responsable')
  @Get('user')
  async findAllByUser(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('userId query parameter is required');
    }
    return this.usageService.findAllByUser(userId);
  }

  // Get all present users (restricted to responsable)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('responsable')
  @Get('present-users')
  async findPresentUsers() {
    return this.usageService.findPresentUsers();
  }
}