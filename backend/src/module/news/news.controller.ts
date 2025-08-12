import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from 'src/common/Interceptors/upload-options';
import { generateImageUrl } from 'src/common/utils/utils';

@Controller('news')
export class NewsController {
  
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  create(@UploadedFile() image: Express.Multer.File , @Body() createNewsDto: CreateNewsDto ) {
    const newsData = { ...createNewsDto, image: generateImageUrl(image.filename) };
    return this.newsService.create(newsData);
  }

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto , @UploadedFile() image: Express.Multer.File) {
    const newsData = { ...updateNewsDto, ...( image && {image: generateImageUrl(image.filename)})};
    return this.newsService.update(id, newsData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}
