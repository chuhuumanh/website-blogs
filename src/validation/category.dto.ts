import { IsEmpty, IsString } from "@nestjs/class-validator";

export class CategoryDto{
    @IsString()
    @IsEmpty()
    name: string;

    @IsString()
    descriptions: string
}