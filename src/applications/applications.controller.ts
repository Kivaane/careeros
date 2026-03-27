import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(@GetUser('userId') userId: number, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(userId, dto);
  }

  @Get()
  findAll(@GetUser('userId') userId: number) {
    return this.applicationsService.findAll(userId);
  }

  @Get(':id')
  findOne(@GetUser('userId') userId: number, @Param('id') id: string) {
    return this.applicationsService.findOne(id, userId);
  }

  @Patch(':id')
  update(@GetUser('userId') userId: number, @Param('id') id: string, @Body() dto: Partial<CreateApplicationDto>) {
    return this.applicationsService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(@GetUser('userId') userId: number, @Param('id') id: string) {
    return this.applicationsService.remove(id, userId);
  }
}