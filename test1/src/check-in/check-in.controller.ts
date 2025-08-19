import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/user/user.controller';
import { Model } from 'mongoose';
import { CheckIn, CheckInDocument } from './schemas/check-in.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CheckInService } from './check-in.service';

@Controller('check-in')
export class CheckInController {

  constructor(private readonly checkInService: CheckInService) {}
  
  
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Post()
  async create(@Req() req, @Body() createCheckInDto: CreateCheckInDto) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.checkInService.create(userId, userRole, createCheckInDto);
  }

 @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
    @Get()
  async getCheckIn() {
    return this.checkInService.findAllDetailed();
  }

    @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('all')
 async getAllCheckIns() {
    return this.checkInService.findAll();
  }


    @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin','responsable')
  @Get('present')
  async getAllPresentUsers() {
    return this.checkInService.getAllPresentUsers();
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkInService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCheckInDto: UpdateCheckInDto) {
    return this.checkInService.update(+id, updateCheckInDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkInService.remove(+id);
  }
}
