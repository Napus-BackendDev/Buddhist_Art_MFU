import { ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  tel: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  idCard: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  orderArts: string[];
}
