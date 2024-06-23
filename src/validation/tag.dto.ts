import { IsString } from "@nestjs/class-validator";

export class TagDto{
    @IsString()
    name: string
}