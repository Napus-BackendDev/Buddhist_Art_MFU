import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Art, ArtSchema } from './schema/art.schema';
import { ArtsService } from './arts.service';
import { ArtsController } from './arts.controller';

@Module({
  imports: [ MongooseModule.forFeature([{ name: Art.name, schema: ArtSchema }]) ],
  controllers: [ArtsController],
  providers: [ArtsService],
})
export class ArtsModule {}
