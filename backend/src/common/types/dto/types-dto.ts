import { IsNotEmpty, IsString } from 'class-validator';

export class LocalizationDto {
  @IsString()
  @IsNotEmpty()
  th: string;
  @IsString()
  @IsNotEmpty()
  en: string;
}

export class EmailDto {
  @IsString()
  @IsNotEmpty()
  personal: string;
  @IsString()
  @IsNotEmpty()
  university: string;
}
