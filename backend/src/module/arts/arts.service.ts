import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Art, ArtDocument } from './schema/art.schema';
import { Model } from 'mongoose';
import { generateImageUrl } from 'src/common/utils/utils';

@Injectable()
export class ArtsService {
  constructor(
    @InjectModel(Art.name) private readonly artModel: Model<ArtDocument>,
  ) {}

  async create(createArtDto: CreateArtDto, picture: Express.Multer.File , id?: string ): Promise<ArtDocument> {
    const artData = {
      ...createArtDto,
      user: id || createArtDto.user,
      picture: generateImageUrl(createArtDto.artId, 'arts', picture.filename),
    };

    return await new this.artModel(artData).save();
  }

  async findAll(): Promise<ArtDocument[]> {
    return await this.artModel.find().populate('user', 'username -_id').populate( 'orders' ).exec();
  }

  async findByUser(user: string): Promise<ArtDocument[] | null> {
    const userArts = await this.artModel.find({ user: user }).populate('user' , 'username').exec();
    if (!userArts) throw new NotFoundException('Not found Arts from this user');
    return userArts
  }

  async findOne(id: string): Promise<ArtDocument | null> {
    return await this.artModel.findById(id).populate('user', 'studentId').exec();
  }

  async update(id: string, updateArtDto: UpdateArtDto, picture: Express.Multer.File ): Promise<ArtDocument | null> {
    const art = await this.artModel.findById(id).populate('user','studentId').exec();
    if (!art) throw new NotFoundException('Art not found')
    const artData = {
      ...updateArtDto,
      ...( picture && {picture: generateImageUrl((art.user as any ).studentId , 'arts', picture.filename)}),
    }
    return await this.artModel.findByIdAndUpdate(id, artData, { new: true });
  }

  async remove(id: string) {
    const art = await this.artModel.findByIdAndDelete(id);
    if (!art) throw new NotFoundException('Art not found');
    return { message: 'Deleted' };
  }
}
