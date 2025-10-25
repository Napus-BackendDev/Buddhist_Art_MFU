import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async create(
    createArtDto: CreateArtDto,
    picture: Express.Multer.File,
    id?: string,
    studentId?: string,
  ): Promise<ArtDocument> {
    const artData = {
      ...createArtDto,
      user: id || createArtDto.user,
      picture: generateImageUrl(
        studentId ? studentId : createArtDto.user,
        'arts',
        picture.filename,
      ),
    };

    return await new this.artModel(artData).save();
  }

  async findAll(): Promise<ArtDocument[]> {
    return await this.artModel
      .find()
      .populate('user', 'username -_id')
      .populate('orders')
      .exec();
  }

  async findOne(artId: string): Promise<ArtDocument> {
    const art = await this.artModel.findById(artId).exec();
    if (!art) throw new NotFoundException('Not found Art with this name');
    return art;
  }

  async findByUser(usernameTh: string): Promise<ArtDocument[] | null> {
    const userArts = await this.artModel
      .find()
      .populate({
        path: 'user',
        select: 'username',
        match: { 'username.th': usernameTh },
      })
      .exec();
    const filteredArts = userArts.filter((art) => art.user !== null);
    if (!filteredArts.length)
      throw new NotFoundException('Not found Arts from this user');
    return filteredArts;
  }

  async findByArtName(ArtName: string): Promise<ArtDocument | null> {
    const art = await this.artModel
      .findOne({ artname: ArtName })
      .populate('user', 'username -_id')
      .exec();
    if (!art) throw new NotFoundException('Not found Art with this name');
    return art;
  }

  async update(
    id: string,
    updateArtDto: UpdateArtDto,
    picture: Express.Multer.File,
  ): Promise<ArtDocument | null> {
    const art = await this.artModel
      .findById(id)
      .populate('user', 'studentId')
      .exec();
    if (!art) throw new NotFoundException('Art not found');
    const user = art.user as unknown as { studentId: string };
    const artData = {
      ...updateArtDto,
      ...(picture && {
        picture: generateImageUrl(user.studentId, 'arts', picture.filename),
      }),
    };
    return await this.artModel.findByIdAndUpdate(id, artData, { new: true });
  }

  async remove(id: string) {
    const art = await this.artModel.findByIdAndDelete(id);
    if (!art) throw new NotFoundException('Art not found');
    return { message: 'Deleted' };
  }
}
