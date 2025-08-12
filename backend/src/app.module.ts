
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtsModule } from './module/arts/arts.module';
import { ConfigModule } from '@nestjs/config';
import { PreOrderModule } from './module/pre-order/pre-order.module';
import { NewsModule } from './module/news/news.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/buddhist_art_mfu'),
    ArtsModule,
    PreOrderModule,
    NewsModule,
  ]
})
export class AppModule {}
