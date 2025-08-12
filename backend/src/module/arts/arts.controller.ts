import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ArtsService } from './arts.service';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { imageUploadOptions } from '../../common/Interceptors/upload-options';
import { generateImageUrl } from '../../common/utils/utils';

@Controller('arts')
export class ArtsController {
  constructor(private readonly artsService: ArtsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  create(@UploadedFile() image: Express.Multer.File, @Body() createArtDto: CreateArtDto) {
    const artData = {...createArtDto, image: generateImageUrl(image.filename)};
    return this.artsService.create(artData);
  }

  @Get()
  findAll() {
    return this.artsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  update(@Param('id') id: string, @Body() updateArtDto: UpdateArtDto, @UploadedFile() image: Express.Multer.File) {
    const artData = { ...updateArtDto, ...(image && { image: generateImageUrl(image.filename) })};
    return this.artsService.update(id, artData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artsService.remove(id);
  }
}
