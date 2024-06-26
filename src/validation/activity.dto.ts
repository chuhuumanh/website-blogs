import { IsNotEmpty, IsNumber, IsOptional } from "@nestjs/class-validator";
import { IsString } from "class-validator";

export class ActivityDto{
    @IsNotEmpty()
    @IsNumber()
    userId: number

    @IsNotEmpty()
    @IsNumber()
    postId: number

    @IsNotEmpty()
    @IsString()
    content: string
}