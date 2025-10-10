import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectModel } from '@nestjs/mongoose';
import { News, NewsDocument } from './schema/news.schema';
import { Model } from 'mongoose';
import { generateImageUrl } from 'src/common/utils/utils';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private NewsModule: Model<NewsDocument>,
  ) {}

  async create(
    username: string,
    createNewsDto: CreateNewsDto,
    image: Express.Multer.File,
  ): Promise<NewsDocument> {
    const NewsData = {
      ...createNewsDto,
      image: generateImageUrl(username, 'news', image.filename),
    };
    return await new this.NewsModule(NewsData).save();
  }

  async findAll(): Promise<NewsDocument[]> {
    return await this.NewsModule.find().exec();
  }

  async findOne(id: string): Promise<NewsDocument | null> {
    return await this.NewsModule.findById(id);
  }

  async update(
    id: string,
    username: string,
    updateNewsDto: UpdateNewsDto,
    image: Express.Multer.File,
  ): Promise<NewsDocument | null> {
    const News = await this.NewsModule.findById(id);
    if (!News) throw new NotFoundException('this News is not found');
    const NewsData = {
      ...updateNewsDto,
      ...(image && {
        photo: generateImageUrl(username, 'news', image.filename),
      }),
    };
    return await this.NewsModule.findByIdAndUpdate(id, NewsData);
  }

  remove(id: string) {
    return this.NewsModule.findByIdAndDelete(id);
  }
}
