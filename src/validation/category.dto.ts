import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class CategoryDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    descriptions: string
}