import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from './dto/register-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from 'src/common/interceptors/upload-options';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/common/types/types';
import { RolesGuard } from '../auth/guard/role.guard';
import { CookieUser } from 'src/common/interface/auth-interface';

@Roles(Role.STUDENT)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user/profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  @UseInterceptors(FileInterceptor('photo', imageUploadOptions('profile')))
  async updateProfile(
    @Request() req: CookieUser,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return await this.userService.update(req.user._id, updateUserDto, photo);
  }

  @Delete()
  async deleteProfile(@Request() req: CookieUser) {
    return await this.userService.remove(req.user.sub);
  }
}

@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/user')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @UseInterceptors(FileInterceptor('photo', imageUploadOptions('profile')))
  register(
    @Body() registerUserDto: RegisterDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.userService.register(registerUserDto, photo);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseInterceptors(FileInterceptor('photo', imageUploadOptions('profile')))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return await this.userService.update(id, updateUserDto, photo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
