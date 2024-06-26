import { IsNumber, IsString } from "@nestjs/class-validator";
import { IsNotEmpty } from "class-validator";

export class UpdateCommentDto{
    @IsNumber()
    userId: number

    @IsString()
    @IsNotEmpty()
    content: string
}