import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ProductStatus } from 'src/common/types/types';

export class CreateArtDto {
  @IsString()
  @IsNotEmpty()
  artId: string;
  @IsNotEmpty()
  artname: string;
  @IsOptional()
  @IsObject()
  @IsNotEmpty()
  user: string;
  @IsString()
  @IsNotEmpty()
  size: string;
  @IsString()
  @IsNotEmpty()
  technique: string;
  @IsString()
  @IsNotEmpty()
  price: string;
  @IsString()
  @IsNotEmpty()
  concept: string;
  @IsString()
  @IsNotEmpty()
  type: string;
  @IsString()
  @IsNotEmpty()
  presentation: string;
  @IsOptional()
  @IsEnum(ProductStatus)
  status: ProductStatus;
  @IsString()
  @IsNotEmpty()
  artAddress: string;
  @IsString()
  @IsNotEmpty()
  ratio: string;
}
