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
import { JwtAuthGuard } from '../core/auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageUploadOptions } from 'src/common/interceptors/upload-options';
import { RolesGuard } from '../core/auth/guard/role.guard';
import { Role } from 'src/common/types/types';
import { Roles } from '../core/auth/decorators/roles.decorator';

@Roles(Role.STUDENT)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/profile/arts')
export class ArtsControllerStudent {
  constructor(private readonly artsService: ArtsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('picture', imageUploadOptions('arts')))
  createArts(
    @Request() req,
    @Body() createArtDto: CreateArtDto,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    console.log('REQ USER:', req.user);
    return this.artsService.create(
      createArtDto,
      picture,
      req.user._id,
      req.user.studentId,
    );
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.artsService.findByUser(id);
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('picture', imageUploadOptions('arts')))
  userUpdateArt(
    @Param('id') id: string,
    @Body() updateArtDto: UpdateArtDto,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    return this.artsService.update(id, updateArtDto, picture);
  }

  @Delete('/:id')
  userDeleteArt(@Param('id') id: string) {
    return this.artsService.remove(id);
  }
}

@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/arts')
export class ArtsControllerAdmin {
  constructor(private readonly artsService: ArtsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('picture', imageUploadOptions('arts')))
  create(
    @Body() createArtDto: CreateArtDto,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    return this.artsService.create(createArtDto, picture);
  }

  @Roles(Role.ADMIN)
  @Patch('/:id')
  @UseInterceptors(FileInterceptor('picture', imageUploadOptions('arts')))
  update(
    @Param('id') id: string,
    @Body() updateArtDto: UpdateArtDto,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    return this.artsService.update(id, updateArtDto, picture);
  }

  @Roles(Role.ADMIN)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.artsService.remove(id);
  }
}

@Controller('arts')
export class ArtsControllerPublic {
  constructor(private readonly artsService: ArtsService) {}

  @Get()
  findAll() {
    return this.artsService.findAll();
  }

  @Get('/:artname')
  findOne(@Param('artname') artname: string) {
    return this.artsService.findByArtName(artname);
  }

  @Get('/user/:artname')
  findByUser(@Param('artname') artname: string) {
    return this.artsService.findByUser(artname);
  }
}
