import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectModel } from '@nestjs/mongoose';
import { News, NewsDocument } from './schema/news.schema';
import { Model } from 'mongoose';

@Injectable()
export class NewsService {

  constructor(@InjectModel(News.name) private NewsModel: Model<NewsDocument>) {}

  async create(createNewsDto: CreateNewsDto) : Promise<News> {
    const newsData = new this.NewsModel(createNewsDto);
    return await newsData.save();
  }

  async findAll() : Promise<News[]> {
    return await this.NewsModel.find().exec();
  }

  async findOne(id: string) : Promise<News | null> {
    return await this.NewsModel.findById(id).exec();
  }

  async update(id: string, updateNewsDto: UpdateNewsDto) : Promise<News | null> {
    return await this.NewsModel.findByIdAndUpdate(id, updateNewsDto, { new: true }).exec();
  }

  async remove(id: string) : Promise<News | null> {
    return await this.NewsModel.findByIdAndDelete(id).exec();
  }
}
