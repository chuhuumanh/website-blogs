import { IsString } from "@nestjs/class-validator";

export class CategoryDto{
    @IsString()
    name: string;

    @IsString()
    descriptions: string
}