import { IsString } from "@nestjs/class-validator";
import { IsNotEmpty } from "class-validator";

export class TagDto{
    @IsString()
    @IsNotEmpty()
    name: string
}