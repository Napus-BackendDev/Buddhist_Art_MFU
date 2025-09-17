import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Roles } from '../core/auth/decorators/roles.decorator';
import { Role } from 'src/common/types/types';
import { JwtAuthGuard } from '../core/auth/guard/jwt-auth.guard';
import { RolesGuard } from '../core/auth/guard/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from 'src/common/interceptors/upload-options';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', imageUploadOptions('news')))
  create( @Request() req, @Body() createNewsDto: CreateNewsDto, @UploadedFile() image: Express.Multer.File,
  ) {
    return this.newsService.create(req.user.studentId, createNewsDto, image);
  }

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions('news')))
  update( @Param('id') id: string, @Request() req, @Body() updateNewsDto: UpdateNewsDto, @UploadedFile() image: Express.Multer.File,
  ) {
    return this.newsService.update(id, req.user.username, updateNewsDto, image);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
