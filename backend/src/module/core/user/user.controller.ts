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
import { Role } from 'src/common/types/types';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ------------------  For Student  ----------------------- //

  @Roles(Role.STUDENT)
  @Get('/profile')
  getProfile(@Request() req) {
    const user = this.userService.findByStudentID(req.user.studentId);
    return user;
  }

  @Roles(Role.STUDENT)
  @Patch('/profile')
  @UseInterceptors(FileInterceptor('photo', imageUploadOptions('profile')))
  async updateProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return await this.userService.update(req.user._id, updateUserDto, photo);
  }

  @Roles(Role.STUDENT)
  @Delete('/profile')
  async deleteProfile(@Request() req) {
    return await this.userService.remove(req.user.sub);
  }

  // ------------------  For Admin  ----------------------- //

  @Roles(Role.ADMIN)
  @Post('/register')
  @UseInterceptors(FileInterceptor('photo', imageUploadOptions('profile')))
  resigter(
    @Body() registerUserDto: RegisterDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return this.userService.resigter(registerUserDto, photo);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('photo', imageUploadOptions('profile')))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    return await this.userService.update(id, updateUserDto, photo);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
