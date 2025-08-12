import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateArtDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(1)
    price: number;

    @IsString()
    @IsNotEmpty()
    style: string;

    @IsString() 
    @IsNotEmpty()
    user: string;

    @IsString()
    @IsNotEmpty()
    size: string;
}