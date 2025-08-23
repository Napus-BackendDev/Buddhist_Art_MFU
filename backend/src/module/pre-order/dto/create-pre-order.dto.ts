import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { Art } from "src/module/arts/schema/art.schema";

export class CreatePreOrderDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    idCard: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString({ each: true })
    @IsObject()
    @IsNotEmpty()
    orderArts: string[] | Art[];
}
