import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {

    const AdminData = {
      studentId: this.configService.get<String>('ADMIN_USERNAME'),
      username: {
        th: 'แอดมิน',
        en: 'Admin'
      },
      password: this.configService.get<String>('ADMIN_PASSWORD'),
      email: this.configService.get<string>('ADMIN_EMAIL'),
      role: 'admin'
    }
      
    this.logger.log(`🌱 เริ่มการ Seed Admin Account`)
    this.logger.log(`📡 กำลังเชื่อมต่อกับ MongoDB:${this.configService.get<string>('MONGO_URL')}`)
    this.logger.log(`👤 Admin_Username:${AdminData.studentId}`)
    this.logger.log(`🔑 Admin_Password:${AdminData.password}`)
    this.logger.log(`🔧 Admin_Role:${AdminData.role}`)
    
    const exists = await this.userModel.findOne({ studentId: AdminData.studentId }).lean();
    if (exists) {
      this.logger.log('❌ You have admin already')
      return;
    }

    await this.userModel.create(AdminData)
    this.logger.log('✅ สร้างแอดมินสำเร็จ')
    
  }
}
