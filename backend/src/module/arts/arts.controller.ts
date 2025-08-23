import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { ArtsService } from './arts.service';
import { CreateArtDto } from './dto/create-art.dto';
import { UpdateArtDto } from './dto/update-art.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from 'src/common/interceptors/upload-options';
import { RolesGuard } from '../auth/guard/role.guard';
import { Role } from 'src/common/types/types';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ArtsController {
  constructor(private readonly artsService: ArtsService) {}

  // ------------------  For Student  ----------------------- //

  @Roles(Role.STUDENT)
  @Post('/profile/arts')
  @UseInterceptors(FileInterceptor('picture', imageUploadOptions('arts')))
  createArts(
    @Request() req,
    @Body() createArtDto: CreateArtDto,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    return  this.artsService.create(createArtDto, picture, req.user._id);
  }

  @Roles(Role.STUDENT)
  @Patch('/profile/arts/:id')
  @UseInterceptors(FileInterceptor('picture', imageUploadOptions('arts')))
  userUpdateArt(
    @Param('id') id: string,
    @Body() updateArtDto: UpdateArtDto,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    return this.artsService.update( id , updateArtDto , picture)
  }

  @Roles(Role.STUDENT)
  @Delete('/profile/arts/:id')
  userDeleteArt(@Param('id') id: string) {
    return this.artsService.remove(id);
  }

  // ------------------  For Admin  ----------------------- //

  @Roles(Role.ADMIN)
  @Get('/arts')
  findAll() {
    return this.artsService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get('/arts/:id')
  findOne(@Param('id') id: string) {
    return this.artsService.findByUser(id);
  }

  @Roles(Role.ADMIN)
  @Post('/arts')
  @UseInterceptors(FileInterceptor('picture', imageUploadOptions('arts')))
  create(
    @Body() createArtDto: CreateArtDto,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    return this.artsService.create(createArtDto , picture);
  }

  @Roles(Role.ADMIN)
  @Patch('/arts/:id')
  @UseInterceptors(FileInterceptor('picture', imageUploadOptions('arts')))
  update(@Param('id') id: string, @Body() updateArtDto: UpdateArtDto, @UploadedFile() picture: Express.Multer.File) {
    return this.artsService.update( id , updateArtDto , picture)
  }

  @Roles(Role.ADMIN)
  @Delete('/arts/:id')
  remove(@Param('id') id: string) {
    return this.artsService.remove(id);
  }
}
