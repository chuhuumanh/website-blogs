import { IsNotEmpty, IsNumber, IsOptional } from "@nestjs/class-validator";
import { IsString } from "class-validator";

export class ActivityCreateDto{
    userId: number

    @IsNotEmpty()
    @IsNumber()
    postId: number

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    content: string

    @IsNotEmpty()
    @IsString()
    action: string
}