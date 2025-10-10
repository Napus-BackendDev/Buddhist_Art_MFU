import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from './dto/register-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateImageUrl } from 'src/common/utils/utils';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async resigter(
    resigterUserDto: RegisterDto,
    photo: Express.Multer.File,
  ): Promise<UserDocument> {
    const studentId = resigterUserDto.studentId;
    const exists = await this.userModel.findOne({ studentId }).exec();

    if (exists) throw new ConflictException('This studentId already exists');

    const userData = {
      ...resigterUserDto,
      photo: generateImageUrl(studentId, 'profile', photo.filename),
    };

    const createdUser = new this.userModel(userData);
    return await createdUser.save();
  }

  async findByStudentID(studentId: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ studentId }).populate('arts').exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    photo: Express.Multer.File,
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findById(id).exec();
    const userData = {
      ...updateUserDto,
      ...(photo && {
        photo: generateImageUrl(
          user?.studentId || '',
          'profile',
          photo.filename,
        ),
      }),
    };
    if (!user || !user._id)
      throw new NotFoundException('User not found or missing user ID');
    return await this.userModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async remove(id: string) {
    return await this.userModel.findOneAndDelete({ _id: id });
  }
}
