import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: any) {
    // req.user is attached by the JwtAuthGuard/Strategy
    return this.usersService.findUserById(req.user.id);
  }

  @Put('me')
  async updateMe(@Req() req: any, @Body() updateDto: UpdateUserDto) {
    return this.usersService.updateUser(req.user.id, updateDto);
  }
}
