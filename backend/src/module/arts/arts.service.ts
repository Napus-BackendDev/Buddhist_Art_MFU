import { Injectable } from '@nestjs/common';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Art, ArtDocument } from './schema/art.schema';
import { Model } from 'mongoose';

@Injectable()
export class ArtsService {
  constructor(@InjectModel(Art.name) private artModel: Model<ArtDocument>) {}

  async create(createArtDto: CreateArtDto) : Promise<Art> {
    const createArt = new this.artModel(createArtDto);
    return await createArt.save();
  }

  async findAll() : Promise<Art[]> {
    return await this.artModel.find().exec();
  }

  async findOne(id: string) : Promise<Art | null> {
    return await this.artModel.findById(id).exec();
  }

  async update(id: string, updateArtDto: UpdateArtDto) : Promise<Art | null> {
    return await this.artModel.findByIdAndUpdate(id, updateArtDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Art | null> {
    return await this.artModel.findByIdAndDelete(id).exec();
  }
}
