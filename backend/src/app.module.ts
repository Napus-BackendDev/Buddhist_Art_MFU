import { Module } from '@nestjs/common';
import { UserModule } from './module/core/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './module/core/auth/auth.module';
import { ArtsModule } from './module/arts/arts.module';
import { OrderModule } from './module/order/order.module';
import { NewsModule } from './module/news/news.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost:27017/buddhist_art_mfu'),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UserModule,
    AuthModule,
    ArtsModule,
    OrderModule,
    NewsModule
  ],
})
export class AppModule {}
