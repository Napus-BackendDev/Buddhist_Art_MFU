import { Module } from '@nestjs/common';
import { ArtsService } from './arts.service';
import {
  ArtsControllerAdmin,
  ArtsControllerPublic,
  ArtsControllerStudent,
} from './arts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Art, ArtSchema } from './schema/art.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Art.name, schema: ArtSchema }])],
  controllers: [
    ArtsControllerAdmin,
    ArtsControllerPublic,
    ArtsControllerStudent,
  ],
  providers: [ArtsService],
})
export class ArtsModule {}
