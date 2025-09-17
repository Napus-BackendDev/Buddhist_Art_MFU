import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EmailDto, LocalizationDto } from 'src/common/types/dto/types-dto';
import { Role } from 'src/common/types/types';

export class RegisterDto {

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => LocalizationDto)
  readonly username: LocalizationDto;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => EmailDto)
  readonly email: EmailDto;

  @IsString()
  @IsNotEmpty()
  readonly studentId: string;


  @IsString()
  readonly tel: string;

  @IsOptional()
  @IsEnum(Role)
  readonly role: string;
}
